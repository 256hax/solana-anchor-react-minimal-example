# Anchor Tutorial Example 3
## Source
[project-serum/anchor/examples/tutorial/basic-3/](https://github.com/project-serum/anchor/tree/master/examples/tutorial/basic-3)

## declare_id
Should replace declare_id to your value when deploy. It's also including "% anchor test --skip-local-validator".

### puppet
```
% solana address -k target/deploy/puppet-keypair.json
[puppet publickey]
```

Replace declare_id to [puppet publickey] at
- `puppet = "[puppet publickey]"
` in Anchor.toml
- `declare_id!([puppet publickey])` in programs/puppet/src/lib.rs

### puppet-master
```
% solana address -k target/deploy/puppet_master-keypair.json
[puppet-master publickey]
```

Replace declare_id to [puppet-master publickey] at
- `puppet_master = "[puppet publickey]"
` in Anchor.toml
- `declare_id!([puppet-master publickey])` in programs/puppet-master/src/lib.rs
