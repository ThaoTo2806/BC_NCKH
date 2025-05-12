import axios from '../utils/axios.customize';
import axiosInstance from './axios.customize'; 


export const registerAPI = (username: string, email: string, citizen_id: string, common_name: string, organization: string, organizational_unit: string, country: string, state: string, locality: string, role: string, dob: string) => {
  const url = `/api/v1/auth/register`
  return axios.post(url, { username, email, citizen_id, common_name, organization, organizational_unit, country, state, locality, role,dob })
}
export const fetchQRData = () => {
  const url = "/api/v1/QR/generate-qr";

  return axios.get(url);
}
export const fetchDegree = (status: string, date?: string) => {
  let url = `/api/v1/degrees?status=${status}`;
  if (date) {
    url += `&date=${date}`;
  }
  return axios.get(url);
}

export const loginWithTokenAPI = (token: string) => {
  const url = `/api/v1/auth/loginwithToken`;
  return axios.post(url, { token });
}
export const UpdateDegree = (status: String, id: number) => {
  const url = `api/v1/degrees/${id}?status=${status}`;
  return axios.put(url);
}
export const loginAPI = (username: string, password: string) => {

  const url = `/api/v1/auth/login`;
  return axios.post(url, { username: username, password })
}

export const getAllUsers = () => {

  const url = `/api/v1/users`;
  return axios.get(url);
}

export const getUserById = (id: string) => {
  const url = `/api/v1/users/${id}`;
  return axios.get(url);
};


export const resetPassword = (common_name: string, username: string, citizen_id: string) => {
  const url = `/api/v1/users/reset-password`;
  return axios.post(url, { common_name, username, citizen_id });

}

export const getAllDegrees = ({ status }) => {
  const url = `/api/v1/degrees?status=${status}`;
  return axios.get(url);
}

export const getAllDegreesNoStatus = () => {
  const url = `/api/v1/degrees`;
  return axios.get(url);
}

export const getDegreeByUserId = (id: string) => {
  const url = `/api/v1/users/degrees/${id}`;
  return axios.get(url);
}

export const getDegreeById = (id: string) => {
  const url = `/api/v1/degrees/${id}`;
  return axios.get(url);
}

export const changePasswordAPI = async (
  username: string,
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  const url = `/api/v1/users/change-password`;

  try {
    const response = await axios.post(url, {
      username,
      oldPassword,
      newPassword,
      confirmPassword,
    });
    return response;

  } catch (error: any) {
    console.error("Error changing password:", error.response?.data || error);
    return { success: false, message: "Lỗi khi đổi mật khẩu!" };
  }
};
// Cập nhật mã PIN
export const createPinAPI = async (username: string, pin: string) => {
  const url = `/api/v1/users/create-pin`;

  try {
    return axios.post(url, { username, pin });
  } catch (error: any) {
    console.error("Error creating PIN:", error.response?.data || error);
    return { success: false, message: "Lỗi khi tạo mã PIN!" };
  }
};

export const getPinAPI = async (username: string) => {
  const url = `/api/v1/users/get-pin?username=${encodeURIComponent(username)}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    console.error('Error getting PIN:', error.response?.data || error);
    return { success: false, message: 'Lỗi khi lấy mã PIN!' };
  }
};

export const addDegree = async (formData: FormData) => {
  // return await axios.post('http://192.168.1.18:3001/api/v1/degrees', formData, {
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //   },
  // });
  return await axios.post('/api/v1/degrees', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};


export const getTime = async () => {
  const url = `/api/v1/time/getTime`;
  return axios.get(url);
}


export const updateQueryTime = async (id: string) => {
  const url = `/degrees/updateTimeQuery/${id}`;
  return axios.patch(url);
}

export const generateDegreeQRCode = async (degreeId: string) => {
  try {
    const url = `/api/v1/degrees/${degreeId}/qrcode`; // Đường dẫn API theo yêu cầu
    const response = await axios.get(url);
    return response.qrCode; // Giả sử API trả về qrCode

  } catch (error) {
    console.error("Lỗi khi tạo mã QR:", error);
    throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm
  }
};


export const getDegressBatch = async () => {
  const url = `/api/v1/degrees/batch/pending`;
  return axios.get(url);
}

export const approveBatch = async (data: String[]) => {
  const url = `/api/v1/degrees/batch/approve`;
  return axios.post(url, { degreeIds: data });
}
export const getInfor = async () => {
  const url = `/api/v1/test/degree-info`;
  return axios.get(url);
}