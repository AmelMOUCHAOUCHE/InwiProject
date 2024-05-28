import { LightningElement, api, track, wire } from 'lwc';
import fetchLookupData from '@salesforce/apex/AgenceController.fetchLookupData';
import fetchDefaultRecord from '@salesforce/apex/AgenceController.fetchDefaultRecord';

const DELAY = 300; // delay apex callout timing in milliseconds  

export default class Agence extends LightningElement {
    @api label = 'Account';
    @api placeholder = 'search...'; 
    @api iconName = 'standard:account';
    @api sObjectApiName = 'Account';
    @api defaultRecordId = '';
    @api selectedType = '' ;
    @api distributorId = '' ;
    @api required = false;  // property to make the field required

    @track agenceId = '';
    @track agenceName = '';
    @track errorMessage = ''; // property to hold error message

    lstResult = [];   
    hasRecords = true; 
    searchKey = '';  
    isSearchLoading = false;  
    delayTimeout;
    selectedRecord = {}; 

    connectedCallback() {
        if (this.defaultRecordId !== '') {
            fetchDefaultRecord({ recordId: this.defaultRecordId, sObjectApiName: this.sObjectApiName })
                .then((result) => {
                    if (result !== null) {
                        this.selectedRecord = result;
                        this.handleSelectRecordHelper(); 
                    }
                })
                .catch((error) => {
                    this.error = error;
                    this.selectedRecord = {};
                });
        }
    }

    @wire(fetchLookupData, { searchKey: '$searchKey', sObjectApiName: '$sObjectApiName', selectedType: '$selectedType', distributorId: '$distributorId' })
    searchResult({ error, data }) {
        this.isSearchLoading = false;
        if (data) {
            this.hasRecords = data.length !== 0;
            this.lstResult = [...data]; 
        } else if (error) {
            console.log('error---> ' + JSON.stringify(error));
        }
    }

    handleKeyChange(event) {
        this.isSearchLoading = true;
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
        }, DELAY);
    }

    toggleResult(event) {
        const lookupInputContainer = this.template.querySelector('.lookupInputContainer');
        const clsList = lookupInputContainer.classList;
        const whichEvent = event.target.getAttribute('data-source');
        switch (whichEvent) {
            case 'searchInputField':
                clsList.add('slds-is-open');
                break;
            case 'lookupContainer':
                clsList.remove('slds-is-open');
                break;
        }
    }

    handleRemove() {
        this.searchKey = '';    
        this.selectedRecord = {};
        this.lookupUpdateHandler(undefined);
        const searchBoxWrapper = this.template.querySelector('.searchBoxWrapper');
        searchBoxWrapper.classList.remove('slds-hide');
        searchBoxWrapper.classList.add('slds-show');
        const pillDiv = this.template.querySelector('.pillDiv');
        pillDiv.classList.remove('slds-show');
        pillDiv.classList.add('slds-hide');
        const removeAgenceEvent = new CustomEvent('lookupupdate', {
            detail: '' 
        });
        this.dispatchEvent(removeAgenceEvent);
    }

    handleSelectedRecord(event) {   
        const objId = event.target.getAttribute('data-recid');
        this.selectedRecord = this.lstResult.find(data => data.Id === objId);
        this.lookupUpdateHandler(this.selectedRecord); 
        this.handleSelectRecordHelper();
    }

    handleSelectRecordHelper() {
        this.template.querySelector('.lookupInputContainer').classList.remove('slds-is-open');
        const searchBoxWrapper = this.template.querySelector('.searchBoxWrapper');
        searchBoxWrapper.classList.remove('slds-show');
        searchBoxWrapper.classList.add('slds-hide');
        const pillDiv = this.template.querySelector('.pillDiv');
        pillDiv.classList.remove('slds-hide');
        pillDiv.classList.add('slds-show');     
    }

    lookupUpdateHandler(value) {
        if (value && value.Id) {
            this.agenceId = value.Id;
            const lookupUpdateEvent = new CustomEvent('lookupupdate', {
                detail: this.agenceId
            });
            this.dispatchEvent(lookupUpdateEvent);
        }
    }

    @api
    validateLookup() {
        const isValid = !!this.selectedRecord.Id;
        this.errorMessage = this.required && !isValid ? 'This field is required.' : '';
        return isValid;
    }
}