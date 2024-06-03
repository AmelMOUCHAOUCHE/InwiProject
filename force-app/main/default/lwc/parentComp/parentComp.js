import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createUser from '@salesforce/apex/UserController.createUser';
import assignPermissionSets from '@salesforce/apex/UserController.assignPermissionSets';
import assignPermissionSetLicenses from '@salesforce/apex/UserController.assignPermissionSetLicenses';
import createContact from '@salesforce/apex/UserController.createContact';
import updateAccountContactRelation from '@salesforce/apex/UserController.updateAccountContactRelation';
import addUserToQueue from '@salesforce/apex/UserController.addUserToQueue';
import getAgenceQueueName from '@salesforce/apex/UserController.getAgenceQueueName';

export default class ParentComponent extends LightningElement {
    @track selectedType = '';
    @track distributorId = '';
    @track showHelloWorld = true;
    @track showDistributeur = false;
    @track showSection3 = false;
    @track helloWorldValidated = false;
    @track distributeurValidated = false;
    @track Error = '';
    @track agenceId;
    @track agenceName;
    @track nom = '';
    @track prenom = '';
    @track civilite = '';
    @track email = '';
    @track username = '';
    @track produit = [];

    handleTypeChange(event) {
        this.selectedType = event.detail; // Récupère le type d'utilisateur sélectionné
        console.log('Selected Type in handleTypeChange:', this.selectedType);
        this.template.querySelector('c-agence').reset();
        this.agenceId = ''; 
        console.log('Agence in handleTypeChange:', this.agenceId);
    }

    lookupUpdatehandler(event) {
        const detail = event.detail;
        this.distributorId = detail ? detail : ''; // Set to empty string if distributor is removed
        this.Error = '';
        console.log('distributeur in lookupUpdatehandler:', this.distributorId);
        this.template.querySelector('c-agence').reset();
        this.agenceId = ''; 
    }

    lookupUpdatehandlerAgence(event) {
        const detail = event.detail ;
        this.agenceId = detail ? detail : '';
        console.log('Agence in handleAgenceChange:', this.agenceId);
    }

    handleCancel() {
        // Réinitialiser toutes les valeurs des champs
        this.selectedType = '';
        this.distributorId = '';
        this.agenceId = '';
        this.nom = '';
        this.prenom = '';
        this.civilite = '';
        this.email = '';
        this.username = '';
        this.produit = [];
       
        // Réinitialiser les messages d'erreur si nécessaire
        this.template.querySelector('c-agence').reset();
        this.template.querySelector('c-distributeur').reset();
        this.template.querySelector('c-information-contact-user').reset();
        this.template.querySelector('c-type-user').reset();
    }

    handleSave() {
    const agenceComponent = this.template.querySelector('c-agence');
    const isAgenceValid = agenceComponent && agenceComponent.validateLookup();

    const distributeurComponent = this.template.querySelector('c-distributeur');
    const isDistributeurValid = distributeurComponent && distributeurComponent.validateLookup();

    const typeUserComponent = this.template.querySelector('c-type-user');
    const isTypeUserValid = typeUserComponent && typeUserComponent.validateType();

    const contactUserComponent = this.template.querySelector('c-information-contact-user');
    const isContactUserValid = contactUserComponent && contactUserComponent.validateFields();

    if (!isAgenceValid || !isDistributeurValid || !isTypeUserValid || !isContactUserValid) {
        this.showToast('Error', 'Validation failed. Please check the inputs.', 'error');
        return;
    }

    this.showForm = false; // Masquer le formulaire après avoir sauvegardé
    this.showToast('Info', `Selected Type: ${this.selectedType}`, 'info');
    console.log('Selected Type in handleSave:', this.selectedType); 
    let userId; // Déclaration de userId pour qu'il soit accessible dans toute la méthode handleSave
    let contactId; 

    if (this.selectedType === 'Livreur' || this.selectedType === 'Animateur') {
        // Appeler la méthode Apex pour créer un nouvel utilisateur
        createUser({ 
            username: this.username,
            firstName: this.prenom,
            lastName: this.nom,
            email: this.email,
            profileName: 'End User',
            contactId: null 
        })
        .then(result => {
            this.showToast('Success', 'User created successfully', 'success');
            userId = result; 

            let permSetNames = ['LightningRetailExecutionStarter', 'MapsUser'];
            for (let item of this.produit) {
                if (this.selectedType === 'Animateur' && item === 'ADSL') {
                    permSetNames.push('ADSL');
                } else if (this.selectedType === 'Animateur' && item === 'FTTH') {
                    permSetNames.push('FTTH');
                }                
            }
            return assignPermissionSets({ permSetNames: permSetNames, userId: userId });
        })
        .then(() => {
            this.showToast('Success', 'Permission sets assigned successfully', 'success');

            let permSetLicenseNames = ['SFMaps_Maps_LiveMobileTracking', 'IndustriesVisitPsl', 'SFMaps_Maps_Advanced', 'LightningRetailExecutionStarterPsl'];
            return assignPermissionSetLicenses({ permSetLicenseNames: permSetLicenseNames, userId: userId });
        })
        .then(() => {
            this.showToast('Success', 'Permission set licenses assigned successfully', 'success');

            return createContact({
                civilite: this.civilite,
                firstName: this.prenom,
                lastName: this.nom,
                email: this.email,
                userId: userId,
                accountId: this.agenceId,
                inwiCGC_UserCGC__c: userId
            });
        })
        .then(result => {
            contactId = result;
            this.showToast('Success', 'Contact created successfully', 'success');

            if (this.selectedType === 'Livreur') {
                return updateAccountContactRelation({
                    contactId: contactId,
                    accountId: this.agenceId,
                    role: 'inwiB2C_ChefEquipe'
                });
            }
        })
        .then(() => {
            if (this.selectedType === 'Livreur') {
                this.showToast('Success', 'Account-Contact relation created successfully', 'success');
            }
        })
        .catch(error => {
            this.showToast('Error', 'Erreur lors de la création de l\'utilisateur ou de l\'attribution des permissions : ' + (error.body ? error.body.message : error.message), 'error');
            console.error('Erreur lors de la création de l\'utilisateur ou de l\'attribution des permissions : ', error);
        });
    } else if (this.selectedType === 'Utilisateur BO') {
        createContact({
            civilite: this.civilite,
            firstName: this.prenom,
            lastName: this.nom,
            email: this.email,
            userId: null, // Ensure userId is null here as the user is not created yet
            accountId: this.agenceId,
            inwiCGC_UserCGC__c: null
        })
        .then(result => {
            contactId = result;
            this.showToast('Success', 'Contact for Utilisateur BO created successfully', 'success');
            console.log('Contact created with ID:', contactId);

            return createUser({
                username: this.username,
                firstName: this.prenom,
                lastName: this.nom,
                email: this.email,
                profileName: 'BO Distributeur',
                contactId: contactId 
            });
        })
        .then(result => {
            userId = result;
            return getAgenceQueueName({ agenceId: this.agenceId });
        })
        .then(queueName => {
            if (queueName) {
                return addUserToQueue({
                    userId: userId,
                    queueName: queueName
                });
            } else {
                throw new Error('Aucun nom de file d\'attente trouvé pour l\'agence spécifiée.');
            }
        })
        .then(() => {
            this.showToast('Success', 'User for Utilisateur BO created successfully and added to Queue', 'success');
            console.log('User created for Utilisateur BO and added to Queue');
        })
        .catch(error => {
            this.showToast('Error', 'Erreur lors de la création du contact ou de l\'ajout à la file d\'attente : ' + (error.body ? error.body.message : error.message), 'error');
            console.error('Erreur lors de la création du contact ou de l\'ajout à la file d\'attente : ', error);
        });
    }
}


    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

    handleNomUpdate(event) {
        this.nom = event.detail;
    }

    handlePrenomUpdate(event) {
        this.prenom = event.detail;
    }

    handleCiviliteUpdate(event) {
        this.civilite = event.detail;
    }

    handleEmailUpdate(event) {
        this.email = event.detail;
    }

    handleUsernameUpdate(event) {
        this.username = event.detail;
    }

    handleProduitUpdate(event) {
        this.produit = event.detail;
    }
}
