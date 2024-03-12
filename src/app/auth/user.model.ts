export class User {
    
    constructor(
        public email: string, 
        public id: string, 
        private _token: string, 
        private _tokenExperationDate: Date
        ) {}

    get token() {
        if (!this._tokenExperationDate || new Date() > this._tokenExperationDate) {
            return null;
        }
        return this._token;
    }
}