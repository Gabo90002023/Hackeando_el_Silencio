import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase.config";
import { doc, setDoc } from "firebase/firestore";

export const newUser = async (
    nombre: string,
    edad: string,
    email: string,
    password: string,
    phone: string,
    secure_phone: string,
) => {
    const user = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
    );    

    await setDoc(doc(db, "users", user.user.uid),{
        name: nombre,
        age: edad,
        phone: phone,
        secure_phone: secure_phone,
        email: user.user.email,
    });
}