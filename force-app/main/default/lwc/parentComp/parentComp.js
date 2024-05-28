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
    @track produits = ''; // Modifier le nom de la variable pour correspondre au composant enfant
    @track isMultipicklistRequired = false; // Ajout d'une variable pour gérer la visibilité du composant enfant

   

    handleTypeChange(event) {
        this.selectedType = event.detail; // Récupère le type d'utilisateur sélectionné
        console.log('Selected Type in handleTypeChange:', this.selectedType);
        this.updateMultipicklistRequired(); // Mettre à jour la visibilité du composant enfant
    }

    lookupUpdatehandler(event) {
        const detail = event.detail;
        this.distributorId = detail ? detail : ''; // Set to empty string if distributor is removed
        this.Error = '';
        console.log('distributeur in lookupUpdatehandler:', this.distributorId);
    }

    lookupUpdatehandlerAgence(event) {
        const detail = event.detail;
        this.agenceId = detail ? detail : '';
        console.log('Agence in handleTypeChange:', this.agenceId);
    }

    handleCancel() {
        this.showForm = false; // On ajoutera une logique pour revenir à la page de création ou autre
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

        // Vérification si des produits sont sélectionnés
        const produitsComponent = this.template.querySelector('c-multipicklist-product');
        const selectedProducts = produitsComponent ? produitsComponent.getSelectedList() : null;

        if (!isAgenceValid || !isDistributeurValid || !isTypeUserValid || !isContactUserValid || !selectedProducts) {
            this.showToast('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        // this.selectedProducts = selectedProducts;

        this.showForm = false; // Masquer le formulaire après avoir sauvegardé
        this.showToast('Info', `Selected Type: ${this.selectedType}`, 'info');
        console.log('Selected Type in handleSave:', this.selectedType);
        let userId; // Déclaration de userId pour qu'il soit accessible dans toute la méthode handleSave
        let contactId;

        // Logique de sauvegarde pour les différents types d'utilisateur...
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

    // Mettre à jour la visibilité du composant enfant
    updateMultipicklistRequired() {
        this.isMultipicklistRequired = this.selectedType === 'Animateur' || this.selectedType === 'Livreur';
    }

    // Gérer l'événement selectionchange et mettre à jour la variable produits dans le composant parent
    handleSelectionChange(event) {
        this.produits = event.detail; // Mettre à jour la variable produits
        console.log('Selected Products:', this.produits);
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
}
