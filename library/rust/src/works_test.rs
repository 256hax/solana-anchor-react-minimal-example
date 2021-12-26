#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);

        dbg!(result);
    }
}

/*
% cargo test -- --nocapture works_test
    Finished test [unoptimized + debuginfo] target(s) in 0.01s
     Running unittests (target/debug/deps/rust-0b745c09bff3c539)

running 1 test
[src/works_test.rs:8] result = 4
test works_test::tests::it_works ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 1 filtered out; finished in 0.00s

   Doc-tests rust

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
*/
