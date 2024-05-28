import { LightningElement, track, api} from 'lwc';

export default class TypeUser extends LightningElement {
    @track selectedType = ''; // Ne pas définir comme @api
    @track errorMessage = ''; // property to hold error message
    @api required = false;  // property to make the field required


    get options() {
        return [
            { label: 'Utilisateur BO', value: 'Utilisateur BO' },
            { label: 'Animateur', value: 'Animateur' },
            { label: 'Livreur', value: 'Livreur' }
        ];
    }

    handleTypeChange(event) {
        this.selectedType = event.target.value;
        const selectEvent = new CustomEvent('typechange', { detail: this.selectedType });
        this.dispatchEvent(selectEvent);
        console.log('UserType: ' + this.selectedType);  
    }

    @api
    validateType() {
        const isValid = !!this.selectedType;
        this.errorMessage = this.required && !isValid ? 'This field is required.' : '';
        return isValid;
    }
}