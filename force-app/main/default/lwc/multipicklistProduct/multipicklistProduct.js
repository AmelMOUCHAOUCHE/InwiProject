import { LightningElement, track, api } from 'lwc';

export default class MultipicklistProduct extends LightningElement {
    @api typeUser;
    @track options = [
        { label: 'FTTH', value: 'FTTH' },
        { label: 'ADSL', value: 'ADSL' }
    ];
    @track selectedValues = [];
    @track errorMessageProduct = '';

    get isDisabled() {
        return !(this.typeUser === 'Animateur' || this.typeUser === 'Livreur');
    }

    handleSelectionChange(event) {
        this.selectedValues = event.detail.value;
        const selectionChangeEvent = new CustomEvent('selectionchange', {
            detail: this.selectedValues
        });
        this.dispatchEvent(selectionChangeEvent);
    }

    @api
    validateProduct() {
        let isValid = true;
        if (!this.selectedValues || this.selectedValues.length === 0) {
            this.errorMessageProduct = 'This field is required.';
            isValid = false;
        } else {
            this.errorMessageProduct = ''; // Clear the error message if options are selected
        }
        return isValid;
    }
}
