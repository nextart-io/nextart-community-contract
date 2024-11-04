module nextart::product {

    use nextart::badge::{Badge};
    use std::string::{String};
    use sui::{
        sui::SUI,
        balance::{Self,Balance},
    };

    public struct Product has key, store {
        id: UID,
        badge:ID,
        name: String,
        total_supply:u64,
        purchase_amount:u64,
        revenue:Balance<SUI>,
        creator:address,
        description: String,
    }

    public fun create_product(
        badge:&Badge,
        name:String,
        description:String,
        init_supply:u64,
        ctx:&mut TxContext
    ){
        let sender = ctx.sender();
        let badge_id = object::id(badge);
        let product = Product{
            id:object::new(ctx),
            badge:badge_id,
            name:name,
            total_supply:init_supply,
            purchase_amount:0,
            revenue:balance::zero(),
            creator:sender,
            description:description,
        };

        transfer::share_object(product)
    }
}