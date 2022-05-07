const userReducer = (state, action) => {
  switch (action.type) {
    case "SIGNIN":
      return {
        ...state,
        userName: action.payload.userName,
        email: action.payload.email,
        id: action.payload.id,
      };
    case "SIGNOUT":
      return {
        userName: "",
        email: "",
        id: "",
      };
    default:
      return state;
  }
};

export { userReducer };
