enum FORM_INPUT_ERR {"NO_ERROR" = 0, "SHORT_NAME" = 3, "SHORT_ID", "SHORT_PW","BAD_EMAIL_FORM","INCORRECT_PW"}
const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;


const isFormValid = (userName: string, userID: string, email: string, password: string, passwordCheck: string):number =>{
    if(userName.trim().length < 2) return FORM_INPUT_ERR.SHORT_NAME;
    if(userID.trim().length < 4) return FORM_INPUT_ERR.SHORT_ID;
	if(!email_regex.test(email)) return FORM_INPUT_ERR.BAD_EMAIL_FORM;
    if(password.trim().length < 4) return FORM_INPUT_ERR.SHORT_PW;
    if(password !== passwordCheck) return FORM_INPUT_ERR.INCORRECT_PW;
    return FORM_INPUT_ERR.NO_ERROR;
} 

export default isFormValid;