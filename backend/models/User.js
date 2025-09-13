import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"] },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: String,
    city: String,
}, { timestamps: true });

// hash-uim parola inainte de a salva un user, indiferent de unde facem salvarea, cu middleware-ul `pre`, inainte de a face un `save` in baza de date in user.repository
// In contextul unui pre-save hook, this reprezinta documentul curent care urmeaza sa fie salvat în MongoDB.
userSchema.pre('save', async function () {
    //de exemplu la updates User, nu vom hash-ui parola din nou daca nu e modificata si ea
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;