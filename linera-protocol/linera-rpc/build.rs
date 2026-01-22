// Copyright (c) Zefchain Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

fn main() -> Result<(), Box<dyn std::error::Error>> {
    use std::io::Write as _;
    let out_dir: std::path::PathBuf = std::env::var("OUT_DIR")?.into();

    // Get the crate root directory (where Cargo.toml is)
    let manifest_dir = std::env::var("CARGO_MANIFEST_DIR")?;
    
    // Build include paths: crate root + protoc include directory (for google/protobuf/*.proto)
    // Store as owned Strings so they live long enough
    let mut include_strings = vec![manifest_dir];
    if let Ok(protoc_include) = std::env::var("PROTOC_INCLUDE") {
        include_strings.push(protoc_include);
    }
    // Convert to &str slice for compile_protos
    let include_refs: Vec<&str> = include_strings.iter().map(|s| s.as_str()).collect();
    
    tonic_prost_build::configure()
        .file_descriptor_set_path(out_dir.join("file_descriptor_set.bin"))
        .protoc_arg("--experimental_allow_proto3_optional")
        .compile_protos(&["proto/rpc.proto"], &include_refs)?;

    let subject_alt_names = vec!["localhost".to_string()];
    let cert = rcgen::generate_simple_self_signed(subject_alt_names)?;

    // Write the certificate to a file (PEM format)
    let mut cert_file = out_dir.clone();
    cert_file.push("self_signed_cert.pem");
    let cert_file = format!("{}", cert_file.display());
    let mut cert_file = std::fs::File::create(cert_file)?;
    cert_file.write_all(cert.serialize_pem()?.as_bytes())?;

    // Write the private key to a file (PEM format)
    let mut key_file = out_dir.clone();
    key_file.push("private_key.pem");
    let key_file = format!("{}", key_file.display());
    let mut key_file = std::fs::File::create(key_file)?;
    key_file.write_all(cert.serialize_private_key_pem().as_bytes())?;

    cfg_aliases::cfg_aliases! {
        with_testing: { any(test, feature = "test") },
        web: { all(target_arch = "wasm32", target_os = "unknown", feature = "web") },
        with_metrics: { all(not(web), feature = "metrics") },
        with_server: { all(not(web), feature = "server") },
        with_simple_network: { all(not(web), feature = "simple-network") },
    };

    Ok(())
}
