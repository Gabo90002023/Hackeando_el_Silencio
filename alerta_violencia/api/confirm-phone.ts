import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./firebase.config";

export const createRecaptchaVerifier = (containerId: string): RecaptchaVerifier => {
    return new RecaptchaVerifier(auth, containerId, {
        size: "invisible",
        callback: () => {
            
        },
        "expired-callback": () => {
            console.warn("reCAPTCHA expirado, recarga el verificador.");
        },
    });
};

export const signWithPhone = async (phone: string, recaptchaVerifier: RecaptchaVerifier) => {
    const confirmation = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
    return confirmation;
};

export const verifyCode = async (confimation: ConfirmationResult, codeSMS: string) => {
    const result = await confimation.confirm(codeSMS);
    if (result.user.uid) {
        return true;
    }
    return false;
};
