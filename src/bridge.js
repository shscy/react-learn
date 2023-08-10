
import { invoke } from '@tauri-apps/api/tauri';

export function loginRegister(account, password, callback, failed) {
    let status = false;
    console.log("start to login");
    invoke('login_or_register', {
        account: account,
        password: password,
    }).then(data => {
        console.log("login or reigser success ", data);
        if (data) {
            callback();
        } else {
            failed();
        }
    }).catch((error) => {
        console.error("login_register failed ", error)
    });
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