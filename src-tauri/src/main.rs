#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod account;
mod aes_util;
use std::{
    borrow::Cow,
    collections::{hash_map, HashMap},
    sync::{Arc, Mutex},
};

use account::AccountManager;
use google_authenticator::GoogleAuthenticator;
use md5;
use serde::{Deserialize, Serialize};
use tauri::{Manager, Size, PhysicalSize};
#[macro_use]
extern crate lazy_static;

lazy_static! {
    static ref ACCOUNT_MANAGER: account::FileAccountManager =
        account::FileAccountManager { root: "".to_string() };
    static ref UM: UserMemory = UserMemory::new();
}

struct memItem {
  info: account::AccountInfo,
  passwd_md5: Vec<u8>,
}
struct UserMemory {
    user: Arc<Mutex<HashMap<String, memItem>>>,
}

impl UserMemory {
    fn new() -> UserMemory {
        UserMemory {
            user: Arc::new(Mutex::new(HashMap::default())),
        }
    }
    fn create(&self, account: &str, passwd_md5:&[u8], info: account::AccountInfo) {
        let mut data =
            self.user.lock().unwrap();
        let mut v = Vec::with_capacity(passwd_md5.len());
        v.extend_from_slice(passwd_md5);
        data.insert(account.to_string(), memItem { info: info, passwd_md5: v});
    }

    fn update(&self, account: &str,  info: &account::AccountInfo) {
      let mut data =
          self.user.lock().unwrap();
      let ret = data.get_mut(account).unwrap();
      ret.info = info.clone();
  }

    fn query(&self, account: &str) -> Option<(Vec<u8>, account::AccountInfo)> {
        let data =
            self.user.lock().unwrap();
        match data.get(account) {
            Some(v) => Some((v.passwd_md5.clone(), v.info.clone())),
            _ => None,
        }
    }

    fn is_exists(&self, account: &str) -> bool {
        let data =
            self.user.lock().unwrap();
        data.get(account).is_some()
    }
}

#[tauri::command(rename_all = "snake_case")]
fn verify_account(account: String) -> bool {
    let m = &ACCOUNT_MANAGER;
    if !m.is_user_exists(account.as_str(), false) {
        return false;
    }
    return true;
}

#[tauri::command(rename_all = "snake_case")]
fn get_passwd(account: String) -> Option<account::AccountInfo> {
    let data = UM.query(account.as_str());
    if data.is_none() {
        return None;
    }
    return Some(data.unwrap().1.clone());
}

#[tauri::command(rename_all = "snake_case")]
fn save_user(account: String, user: account::AccountInfo) {
    UM.update(account.as_str(), &user);
    let m = &ACCOUNT_MANAGER;
    let data = UM.query(account.as_str());
    m.save(account.as_str(), data.unwrap().0.as_slice(), &user);
}

#[tauri::command(rename_all = "snake_case")]
fn add_item(account: String, info: account::PasswdItem) -> Result<(), ()>{
  let mut user = UM.query(account.as_str()).unwrap();
  user.1.items.push(info);
  save_user(account, user.1);
  return Ok(())
}


#[tauri::command(rename_all = "snake_case")]
fn login_or_register(account: String, password:String) -> bool {
    let passwd_md5 = md5::compute(password.as_bytes());
    let m = &ACCOUNT_MANAGER;
    if !m.is_user_exists(account.as_str(), true) {
        m.create_user(account.as_str(), &passwd_md5.0[..]).unwrap();
        println!(
            "user {:?} is not register, register new user ",
            account.as_str()
        );
    }
    println!("get user account {} password {} ", account.as_str(), password.as_str());
    match m.get_account_content(account.as_str(), &passwd_md5.0[..]) {
        Some(v) => {
            UM.create(account.as_str(), &passwd_md5.0[..], v);
            return true;
        }
        _ => {
          println!("login failed");
            return false;
        }
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app|{
            let main_window = app.get_window("main").unwrap();
            main_window.set_size(Size::Physical(PhysicalSize { width: 2100, height: 1600 })).unwrap();
            return Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            verify_account,
            save_user,
            login_or_register,
            get_passwd,
            add_item,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
