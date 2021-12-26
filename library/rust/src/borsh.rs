use borsh::{BorshSerialize, BorshDeserialize};

#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug)]
struct A {
    x: u64,
    y: String,
}

#[test]
fn borsh_test_simple_struct() {
    let a = A {
        x: 3301,
        y: "liber primus".to_string(),
    };
    let encoded_a = a.try_to_vec().unwrap();
    let decoded_a = A::try_from_slice(&encoded_a).unwrap();
    assert_eq!(a, decoded_a);

    dbg!(a);
    dbg!(encoded_a);
    dbg!(decoded_a);
}

/*
% cargo test -- --nocapture borsh_test_simple_struct
    Finished test [unoptimized + debuginfo] target(s) in 0.01s
     Running unittests (target/debug/deps/rust_sample-5676dc4c6fa69f76)

running 1 test
[src/main.rs:20] a = A {
    x: 3301,
    y: "liber primus",
}
[src/main.rs:21] encoded_a = [
    229,
    12,
    0,
    0,
    0,
    0,
    0,
    0,
    12,
    0,
    0,
    0,
    108,
    105,
    98,
    101,
    114,
    32,
    112,
    114,
    105,
    109,
    117,
    115,
]
[src/main.rs:22] decoded_a = A {
    x: 3301,
    y: "liber primus",
}
test test_simple_struct ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
*/
