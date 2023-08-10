use ring::aead::*;
use ring::pbkdf2;
use ring::pbkdf2::*;
use ring::rand::SystemRandom;
use ring::hmac::HMAC_SHA256;
use std::num::NonZeroU32;

const SALT: [u8;6] = [b'z', b'x', b'l', b's', b'c', b'y'];

pub fn encode(password: &[u8], data_str:&str) ->Vec<u8>{
    let mut data = Vec::with_capacity(data_str.len());
    data.extend_from_slice(data_str.as_bytes());
    let n_iter = NonZeroU32::new(100).unwrap();
    let mut key = [0; 32];
    derive(pbkdf2::PBKDF2_HMAC_SHA256, n_iter, &SALT, &password[..], &mut key);

    let nonce_data = [124; 12]; // Just an example
    let key = UnboundKey::new(&CHACHA20_POLY1305, &key).unwrap();
    let key = LessSafeKey::new(key);
    println!("{data:?}");
    
    // encoding
    let nonce = Nonce::assume_unique_for_key(nonce_data);
    key.seal_in_place_append_tag(nonce, Aad::empty(), &mut data).unwrap();
    println!("{data:?}");
    return data;
}


pub fn deocde<'a>(en_data: &'a mut Vec<u8>, passwd:&[u8]) ->Option<&'a[u8]>{
    let password = passwd;
    let n_iter = NonZeroU32::new(100).unwrap();
    let mut key = [0; 32];
    derive(pbkdf2::PBKDF2_HMAC_SHA256, n_iter, &SALT, &password[..], &mut key);
    let nonce_data = [124; 12]; 
    let key = UnboundKey::new(&CHACHA20_POLY1305, &key).unwrap();
    let key = LessSafeKey::new(key);
    // decoding
    let nonce = Nonce::assume_unique_for_key(nonce_data);
    if let Ok(data) = key.open_in_place(nonce, Aad::empty(), en_data) {
        return Some(data);
    }else{
        return None     
    }
    
} 


#[cfg(test)]
mod test {
    use super::*;
    #[test]
    fn test_encdoe(){
        let mut en_data = encode("zxlscy1028".as_bytes(), "hello word zxl");
        println!("encode success\n");
        // let mut dest = Vec::with_capacity(64);
        let ok = deocde(&mut en_data, "zxlscy1028".to_string());
        let body = String::from_utf8_lossy(ok).to_string();
        println!("body {:?}", body);
    }

}