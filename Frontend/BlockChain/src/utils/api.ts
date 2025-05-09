import axios from '../utils/axios.customize';


export const registerAPI = (username: string,
  email: string,
  citizen_id: string,
  common_name: string,
  organization: string,
  organizational_unit: string,
  country: string,
  state: string,
  locality: string,
  role: string
) => {
  const url = `/api/v1/auth/register`
  return axios.post(url, { username, email, citizen_id, common_name, organization, organizational_unit, country, state, locality, role })
}

export const fetchDegree = (status: string) => {
  const url = `/api/v1/degrees?status=${status}`;
  return axios.get(url);
}

export const loginWithTokenAPI  = (token : string) => {
  const url  = `/api/v1/auth/loginwithToken`;
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
    return axios.post(url, {username, pin});
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
    return {success: false, message: 'Lỗi khi lấy mã PIN!'};
  }
};

export const addDegree = (formData: FormData) => {
  return axios({
    method: 'post',
    url: '/api/v1/degrees',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getTime = async() => {
  const url = `/api/v1/time/getTime`;
  return axios.get(url);
}
