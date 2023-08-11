use std::io::{Write, Read};
use std::path::{Path, PathBuf};
use std::{fs, os};
use std::fs::File;
use serde::{Deserialize, Serialize};
use super::aes_util;

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct PasswdItem {
  pub uuid:String,
  pub name:String,
  pub passwd:String,
  pub mark:Option<String>,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct AccountInfo {
    pub items: Vec<PasswdItem>,
    pub account: String,
}

pub trait  AccountManager {
    fn is_user_exists(&self, account:&str, create:bool) -> bool;
    fn create_user(&self, account:&str, passwd_md5:&[u8]) -> Result<(), ()>;
    fn get_account_content(&self, account:&str, passwd_ms5: &[u8]) -> Option<AccountInfo>;
    fn save(&self, account:&str, passwd_md5:&[u8], info: &AccountInfo);
}

const DEFAULT_PATH: &'static str = "/Users/zuoxiaoliang/.password/";

fn get_default_path() ->String {
    use std::env;
    let home = env::var("HOME").unwrap();
    return home;
}
// FileAccountManger 采用全量更新的方式
pub struct FileAccountManager {
    pub root: String,
}

impl FileAccountManager {
    fn get_path_or_create(&self, account:&str) -> PathBuf {
        let root_path = if self.root.is_empty() {get_default_path()} else {self.root.clone()};
        let root_path = root_path + "/.password";
        let root = Path::new(root_path.as_str());
        println!("root paht {:?}", root_path.as_str());
        if !root.exists() {
            fs::create_dir(root_path.as_str()).expect(format!("create dir {:?} failed", root_path.as_str()).as_str());
        }
        let account_path = root.join(format!(".{}", account));
        return account_path;
    }
}
impl AccountManager for FileAccountManager {
    fn is_user_exists(&self, account:&str, create: bool) -> bool {
        let account_path = self.get_path_or_create(account);
        if !account_path.exists() {
            return false ;
        }

        return true;
    }

    fn create_user(&self, account:&str, passwd_md5:&[u8]) -> Result<(), ()>{
        let account_path = self.get_path_or_create(account);
        if account_path.exists() {
            return Ok(()) ;
        }
        let mut file = File::create(&account_path).expect("create_user create file failed");
        let content = serde_json::to_string(&AccountInfo{
            account: account.to_string(),
            items: Vec::new(),
        }).unwrap();
        // let content = "[]";
        let data = aes_util::encode(passwd_md5, content.as_str());
        file.write_all(data.as_slice()).expect("write file failed");
        file.sync_all().unwrap();
        println!("create user write {:?}", &data);
        return Ok(());
    }

    fn get_account_content(&self, account:&str, passwd_ms5: &[u8]) -> Option<AccountInfo>{
        let account_path = self.get_path_or_create(account);
        if !account_path.exists() {
            panic!("account_path no exists");
        }
        // let mut file = File::open(&account_path).expect("create_user create file failed");
        let mut data = fs::read(account_path).unwrap();
        let data = aes_util::deocde(&mut data, passwd_ms5);
        if data.is_none() {
            return None;
        }
        println!("account content {:?}", data.unwrap());
        let data = data.unwrap();
        let ret:AccountInfo = serde_json::from_slice(data).unwrap();
        if ret.account.as_str() != account {
            panic!("account not match");
        }
        return Some(ret)    ;
    }

    fn save(&self, account:&str, passwd_md5:&[u8], info: &AccountInfo){
        let account_path = self.get_path_or_create(account);
        if !account_path.exists() {
            panic!("account_path no exists");
        }
        let mut file = File::options().write(true).open(account_path).unwrap();
        let data = serde_json::to_string(info).unwrap();
        let data = aes_util::encode(passwd_md5, data.as_str());
        file.write_all(data.as_slice()).expect("write file failed");
        file.sync_all().unwrap();
    }
}