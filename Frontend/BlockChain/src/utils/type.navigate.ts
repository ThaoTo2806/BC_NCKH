export type RootStackParamList = {
  DegreeApprove: {
    id: number;
    owner_name: string;
    major_name: string;
    degree_name: string;
    issued_at: string;
    status: string;
    degree_image_front: Blob;
    degree_image_back: Blob;
  };
  DegreeApproveList: {
    degree_name: string;
    issued_at: string;
    owner_name: string;
    major_name: string;
    status: string;
    gpa : Double;
  };
  Degree: {
    degree_name: string;
    issued_at: string;
    owner_name: string;
    major_name: string;
    status: string;
    gpa : Double;
    xeploai: string;
  };
  ApproveHistory: undefined;
  Identity: undefined;
  Approve: undefined;
  Login: undefined;
  Register: undefined;
  Verification: {
    degree_name: string;
    issued_at: string;
    owner_name: string;
    major_name: string;
    status: string;
  };
  Home: { username: string; commonName: string; userId: number };
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
  PinScreen: { username: string; actionType: string };
  RefreshPassword: undefined;
  DetailIdentity: {
    id: string;
  };
  RegisterForm1: undefined;
  ListCertificationPersonal: {
    id: string;
    dob: string;
    commonName: string;
  };
  AddDegree: {
    id: string;
    major_id: string;
    degree_name: string;
    degree_type: string;
    graduation_year: string;
    gpa: string;
    hash_qrcode: string;
    imageFrontUri?: string;
    imageFrontName?: string;
  };
  AddDegree1: {
    id: string;
    dob: string;
    commonName: string;
  };
  CreatePinScreen: { username: string; commonName: string };
  QRSCan: undefined;
  ChangePassword: undefined;
  LoginWithToken: undefined;
  HistoryQuery: undefined;
  QRLogin : undefined;
  DisplayImage: {
    id: string;}
};
