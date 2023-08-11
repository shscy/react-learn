
import { invoke } from '@tauri-apps/api/tauri';


export async function verifyAccount(account, callback, failed) {

    console.log("start to login");
    try {
        const data = await invoke('verify_account', { account: account })
        if (data) {
            callback();
            return [true, ""]
        } else {
            failed();
            return [false, ""]
        }
    } catch (e) {
        failed();
        return [false, ""]
    }
    // invoke('verify_account', {
    //     account: account,
    // }).then(data => {
    //     console.log("login or reigser success ", data);
    //     if (data) {
    //         callback();
    //     } else {
    //         failed();
    //     }
    // }).catch((error) => {
    //     console.error("login_register failed ", error)
    //     failed();
    // });
}

export async function loginRegister(account, password, callback, failed) {

    console.log("start to login");
    try {
        let data = await invoke('login_or_register', {
            account: account,
            password: password,
        });
        console.log("login stats", data);
        if(data) {
            return [true, ""]
        }
        return [false, "密码错误请重试"]
    } catch (e) {
        console.log("login reguster failed", e);
        return [false, "密码错误请重试"+ e];
    }
}


    export function getUserInfo(account, callback) {
        let res = null;
        invoke("get_passwd", { account: account }).then(data => {
            console.log("get info ", data);
            if (data != null) {
                callback(data.items == null ? [] : data.items);
            }
        }).catch(err => {
            console.log("gteinfo ", err);
        })
        return res;
    }

    export function saveUserInfo(account, data) {
        invoke("save_user", {
            account: account, user: {
                account: account,
                items: data,
            }
        }).then(data => {
            console.log("get info ", data);

        }).catch(err => {
            console.log("gteinfo ", err);
        })

    }

    export function AddPasswordItem(account, data, callback) {
        invoke("add_item", {
            account: account,
            info: {
                uuid: data.uuid,
                name: data.name,
                passwd: data.password,
                mark: data.mark,
            }
        }).then(data => {
            console.log("get info ", data);
            callback();
        }).catch(err => {
            console.log("gteinfo ", err);
        })
    }