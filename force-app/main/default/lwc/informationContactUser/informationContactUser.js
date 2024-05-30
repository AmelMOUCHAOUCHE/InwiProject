import { LightningElement, track, api } from 'lwc';

export default class InformationContactUser extends LightningElement {
    @api selectedType = ''; // Importer le type utilisateur saisi dans le premier composant

    @track nom = '';
    @track prenom = '';
    @track civilite = '';
    @track email = '';
    @track username = '';
    @track produit = [];

    @track errorMessageCivilite = '';
    @track errorMessageNom = '';
    @track errorMessagePrenom = '';
    @track errorMessageEmail = '';
    @track errorMessageUsername = '';
    @track errorMessageProduit = '';

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
        this.civilite = event.detail.value;
        this.errorMessageCivilite = ''; // Effacer le message d'erreur lorsqu'une sélection valide est effectuée
        this.dispatchUpdateEvent('civilite', this.civilite);
    }

    handleNomChange(event) {
        this.nom = event.target.value;
        this.errorMessageNom = ''; // Effacer le message d'erreur lorsqu'une valeur valide est saisie
        this.dispatchUpdateEvent('nom', this.nom);
    }

    handlePrenomChange(event) {
        this.prenom = event.target.value;
        this.errorMessagePrenom = ''; // Effacer le message d'erreur lorsqu'une valeur valide est saisie
        this.dispatchUpdateEvent('prenom', this.prenom);
    }

    handleEmailChange(event) {
        this.email = event.target.value;
        this.errorMessageEmail = ''; // Effacer le message d'erreur lorsqu'une valeur valide est saisie
        this.dispatchUpdateEvent('email', this.email);
    }

    handleUsernameChange(event) {
        this.username = event.target.value;
        this.errorMessageUsername = ''; // Effacer le message d'erreur lorsqu'une valeur valide est saisie
        this.dispatchUpdateEvent('username', this.username);
    }

    handleProduitChange(event) {
        this.produit = event.detail.value;
        this.errorMessageProduit = ''; // Effacer le message d'erreur lorsqu'une sélection valide est effectuée
        this.dispatchUpdateEvent('produit', this.produit);
    }  
    
    // Dispatch d'un événement personnalisé avec la valeur mise à jour
    dispatchUpdateEvent(fieldName, value) {
        const updateEvent = new CustomEvent(`${fieldName}update`, {
            detail: value
        });
        this.dispatchEvent(updateEvent);
    }

    // Gérer les changements de sélection de produit
    get showProduitField() {
        return this.selectedType === 'Animateur' || this.selectedType === 'Livreur';
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

        if (this.produit.length === 0) { // Vérifier si aucun produit n'a été sélectionné
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
        this.produit = [];

        this.errorMessageCivilite = '';
        this.errorMessageNom = '';
        this.errorMessagePrenom = '';
        this.errorMessageEmail = '';
        this.errorMessageUsername = '';
        this.errorMessageProduit = '';
    }
}
