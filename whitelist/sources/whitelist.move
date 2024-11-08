/*
/// Module: whitelist
module whitelist::whitelist;
*/
module nextart::whitelist{

    use std::string::{String};
    use sui::{
        package,
        vec_map::{Self, VecMap},
        event::emit
    };

    public struct Whitelist has key,store {
        id: UID,
        list: VecMap<String,vector<address>>
    }

    public struct Admin has key {
        id: UID
    }

    public struct Check_Event has copy,drop {
        result: VecMap<String,bool>
    }

    public struct WHITELIST has drop {}

    fun init (otw:WHITELIST, ctx: &mut TxContext) {
        let sender = ctx.sender();
        let deployer = package::claim(otw,ctx);
        let admin = Admin {
            id: object::new(ctx)
        };

        let whitelist = Whitelist {
            id: object::new(ctx),
            list: vec_map::empty()
        };

        transfer::public_share_object(whitelist);
        transfer::transfer(admin,sender);
        transfer::public_transfer(deployer,sender);
    }

    public fun add_address(_admin: &Admin, whitelist: &mut Whitelist, collection: String, addresses: vector<address>, _ctx: &mut TxContext) {
        let list = &mut whitelist.list;
        if(vec_map::contains(list,&collection)) {
            let addresses_vec = vec_map::get_mut(list,&collection);
            let mut i = 0;
            while(i < addresses.length()) {
                if(!vector::contains(addresses_vec,&addresses[i])) {
                    vector::push_back(addresses_vec,addresses[i]);
                };
                i = i + 1;
            }
        } else {
            vec_map::insert(list,collection,addresses);
        }
    }

    public fun check_address(whitelist: &Whitelist, check: address){
        let list = &whitelist.list;
        let mut i = 0;
        let mut result = vec_map::empty<String,bool>();

        while(i < vec_map::size(list)) {
            let (collection, addresses) = vec_map::get_entry_by_idx(list, i);
            vec_map::insert(&mut result, *collection, vector::contains(addresses, &check));
            i = i + 1;
        };

        let event = Check_Event { result: result };
        emit(event);
    }

}



