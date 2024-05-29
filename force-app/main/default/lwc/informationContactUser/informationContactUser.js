/*import { LightningElement, track, api } from 'lwc';

export default class InformationContactUser extends LightningElement {
    //@api selectedType = ''; // importer le typeuser saisi dans le premier composant

    @track nom = '';
    @track prenom = '';
    @track civilite = '';
    @track email = '';
    @track username = '';
    //@track produit = '';

    @track errorMessageCivilite = '';
    @track errorMessageNom = '';
    @track errorMessagePrenom = '';
    @track errorMessageEmail = '';
    @track errorMessageUsername = '';
    // @track errorMessageProduit = '';

    // Définir les options pour la civilité
    get civiliteOptions() {
        return [
            { label: 'M', value: 'M' },
            { label: 'Mlle', value: 'Mlle' },
            { label: 'Mr', value: 'Mr' }
        ];
    }

    // Définir les options pour le champ produit
    /*get produitOptions() {
        return [
            { label: 'FTTH', value: 'FTTH' },
            { label: 'ADSL', value: 'ADSL' }
        ];
    }*/

    /*handleCiviliteChange(event) {
        this.civilite = event.target.value;
        this.errorMessageCivilite = ''; // Clear the error message when a valid selection is made
        this.dispatchUpdateEvent('civilite', this.civilite);
    }

    handleNomChange(event) {
        this.nom = event.target.value;
        this.errorMessageNom = ''; // Clear the error message when a valid value is entered
        this.dispatchUpdateEvent('nom', this.nom);
    }

    handlePrenomChange(event) {
        this.prenom = event.target.value;
        this.errorMessagePrenom = ''; // Clear the error message when a valid value is entered
        this.dispatchUpdateEvent('prenom', this.prenom);
    }

    handleEmailChange(event) {
        this.email = event.target.value;
        this.errorMessageEmail = ''; // Clear the error message when a valid value is entered
        this.dispatchUpdateEvent('email', this.email);
        console.log('email:' + this.email);
    }

    handleUsernameChange(event) {
        this.username = event.target.value;
        this.errorMessageUsername = ''; // Clear the error message when a valid value is entered
        this.dispatchUpdateEvent('username', this.username);
        console.log('UserName:' + this.username);
    }

    /*handleProduitChange(event) {
        this.produit = event.target.value;
        this.errorMessageProduit = ''; // Clear the error message when a valid selection is made
        this.dispatchUpdateEvent('produit', this.produit);
    }*/

    // Dispatch a custom event with updated value
    /*dispatchUpdateEvent(fieldName, value) {
        const updateEvent = new CustomEvent(`${fieldName}update`, {
            detail: value
        });
        this.dispatchEvent(updateEvent);
    }

    // Gérer les changements de sélection de produit
   /* get showProduitField() {
        return this.selectedType === 'Animateur';
    }*/

    /*@api
    validateFields() {
        let isValid = true;

        if (!this.civilite) {
            this.errorMessageCivilite = 'This field is required.';
            isValid = false;
        }

        if (!this.nom) {
            this.errorMessageNom = 'This field is required.';
            isValid = false;
        }

        if (!this.prenom) {
            this.errorMessagePrenom = 'This field is required.';
            isValid = false;
        }

        if (!this.email) {
            this.errorMessageEmail = 'This field is required.';
            isValid = false;
        }

        if (!this.username) {
            this.errorMessageUsername = 'This field is required.';
            isValid = false;
        }

        /*if (this.showProduitField && !this.produit) {
            this.errorMessageProduit = 'This field is required.';
            isValid = false;
        }*/

        /*return isValid;
    }
}*/
/*-------------------------------------------------------------------------------------------------- */
import { LightningElement, track, api } from 'lwc';

export default class InformationContactUser extends LightningElement {
    @api selectedType = ''; // importer le typeuser saisi dans le premier composant

    @track nom = '';
    @track prenom = '';
    @track civilite = '';
    @track email = '';
    @track username = '';
    @track produit = '';

    @track errorMessageCivilite = '';
    @track errorMessageNom = '';
    @track errorMessagePrenom = '';
    @track errorMessageEmail = '';
    @track errorMessageUsername = '';
    @track errorMessageProduit = '';
   
    @track selectedProduits = [];
    @track deuxiemeProduit = '';

    // Définir les options pour la civilité
    get civiliteOptions() {
        return [
            { label: 'M', value: 'M' },
            { label: 'Mlle', value: 'Mlle' },
            { label: 'Mr', value: 'Mr' }
        ];
    }

    // Définir les options pour le champ produit
    get produitOptions() {
        return [
            { label: 'FTTH', value: 'FTTH' },
            { label: 'ADSL', value: 'ADSL' }
        ];
    }

    handleCiviliteChange(event) {
        this.civilite = event.target.value;
        this.errorMessageCivilite = ''; // Clear the error message when a valid selection is made
        this.dispatchUpdateEvent('civilite', this.civilite);
    }

    handleNomChange(event) {
        this.nom = event.target.value;
        this.errorMessageNom = ''; // Clear the error message when a valid value is entered
        this.dispatchUpdateEvent('nom', this.nom);
    }

    handlePrenomChange(event) {
        this.prenom = event.target.value;
        this.errorMessagePrenom = ''; // Clear the error message when a valid value is entered
        this.dispatchUpdateEvent('prenom', this.prenom);
    }

    handleEmailChange(event) {
        this.email = event.target.value;
        this.errorMessageEmail = ''; // Clear the error message when a valid value is entered
        this.dispatchUpdateEvent('email', this.email);
        console.log('email:' + this.email);
    }

    handleUsernameChange(event) {
        this.username = event.target.value;
        this.errorMessageUsername = ''; // Clear the error message when a valid value is entered
        this.dispatchUpdateEvent('username', this.username);
        console.log('UserName:' + this.username);
    }

    handleProduitChange(event) {
        this.produit = event.target.value;
        this.errorMessageProduit = ''; // Clear the error message when a valid selection is made
        this.dispatchUpdateEvent('produit', this.produit);

        // Vérifier si les deux produits sont sélectionnés
        if (this.selectedProduits.length === 2) {
            this.deuxiemeProduit = 'Les deux produits sont sélectionnés';
        } else {
            this.deuxiemeProduit = '';
        }
    }

    // Dispatch a custom event with updated value
    dispatchUpdateEvent(fieldName, value) {
        const updateEvent = new CustomEvent(`${fieldName}update`, {
            detail: value
        });
        this.dispatchEvent(updateEvent);
    }

    // Gérer les changements de sélection de produit
    get showProduitField() {
        return this.selectedType === 'Animateur' || this.selectedType ==='Livreur'
    }

    get showDeuxiemeProduitField() {
        return this.selectedProduits.length > 0;
    }

    @api
    validateFields() {
        let isValid = true;

        if (!this.civilite) {
            this.errorMessageCivilite = 'This field is required.';
            isValid = false;
        }

        if (!this.nom) {
            this.errorMessageNom = 'This field is required.';
            isValid = false;
        }

        if (!this.prenom) {
            this.errorMessagePrenom = 'This field is required.';
            isValid = false;
        }

        if (!this.email) {
            this.errorMessageEmail = 'This field is required.';
            isValid = false;
        }

        if (!this.username) {
            this.errorMessageUsername = 'This field is required.';
            isValid = false;
        }

        if (this.showProduitField && !this.produit) {
            this.errorMessageProduit = 'This field is required.';
            isValid = false;
        }

        return isValid;
    }
    @api
    reset() {
        this.nom = '';
        this.prenom = '';
        this.civilite = '';
        this.email = '';
        this.username = '';
        this.produit = '';

        this.errorMessageCivilite = '';
        this.errorMessageNom = '';
        this.errorMessagePrenom = '';
        this.errorMessageEmail = '';
        this.errorMessageUsername = '';
        this.errorMessageProduit = '';
    }
}