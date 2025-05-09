export type RootStackParamList = {
    DegreeApprove : { 
        id: number,
        owner_name : String,
        major_name: String,
        degree_name : String,
        issued_at: String,
        status : String,
        degree_image_front : Blob,
        degree_image_back : Blob};
    DegreeApproveList : {degree_name : String , issued_at : String ,owner_name : String , major_name : String , status : String};
    Degree : { degree_name : String , issued_at : String , owner_name : String , major_name : String , status : String};
    ApproveHistory : undefined;
    Identity : undefined;
    Approve : undefined;
    Login: undefined;
    Register: undefined;
    Verification: undefined;
    Home: { username: string ,commonName: string };
    UploadFile: undefined;
    CertificateHistory: undefined;
    SecuritySettings: undefined;
    AdminHome: undefined;
    ListIdentity: undefined;
    ListRequests: undefined;
    ListRequestsRejected: undefined;
    ConfirmCertification: {
        id: string;
    };
    Register1: undefined;
    Register2: {
        common_name: string;
        organization: string;
        organizational_unit: string;
        country: string;
        state: string;
        locality: string;
    };
    PinScreen: {username: string; actionType: string};
    RefreshPassword: undefined;
    DetailIdentity: {
        id: string;
    };
    RegisterForm1: undefined;
    ListCertificationPersonal: {
        id: string
    };
    AddDegree: {
        id: string,
        major_id: string,
        degree_name: string,
        degree_type: string,
        graduation_year: string,
        gpa: string,
    };
    AddDegree1: {
        id: string
    }
        id: string
    }
    CreatePinScreen: { username: string ; commonName: string };

};