import bcryptjs from "bcryptjs";

async function hash(password){
    const rounds = getRound();
    return await bcryptjs.hash(password, rounds);
}

async function compare(password, hash){
    return await bcryptjs.compare(password, hash);
}


function getRound(){
    return process.env.NODE_ENV === "production" ? 14 : 1;
}

const password = {
    hash,
    compare
}

export default password;

