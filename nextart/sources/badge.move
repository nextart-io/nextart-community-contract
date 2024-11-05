module nextart::badge {
    use std::string::{String};
    use sui::{
        display,
        package,
    };

    // ===== ERRORS =====

    const EAlreadyMinted:u64 = 0;
    const ENotInWhitelist:u64 = 1;
    
    // ===== STRUCTS =====

    public struct Badge has key, store {
        id: UID,
        name:String,
        description:String,
        collection_id:ID,
    }

    public struct BadgeList has key, store {
        id:UID,
        collections:vector<ID>,
    }

    public struct BadgeCollection has key, store {
        id:UID,
        name:String,
        description:String,
        total_badges:u64,
        badges_whitelist:vector<address>,
        badges_receptions:vector<address>,
    }

    public struct BADGE has drop{}

    // ===== FUNCTIONS =====

     fun init(otw:BADGE, ctx:&mut TxContext){

        let deployer = package::claim(otw,ctx);
        let sender = ctx.sender();
        let mut display = display::new<Badge>(&deployer,ctx);
        
        let badge_list = BadgeList{
            id:object::new(ctx),
            collections:vector::empty(),
        };

        display.add(
            b"image_url".to_string(),
            b"".to_string()
        );

        transfer::public_share_object(badge_list);
        transfer::public_transfer(display,sender);
        transfer::public_transfer(deployer,sender);
    }


    public(package) entry fun create_badge_collection(
        badge_list:&mut BadgeList,
        name:String,
        description:String,
        ctx:&mut TxContext
    ){
        let badge_collection = BadgeCollection{
            id:object::new(ctx),
            name,
            description,
            total_badges:0,
            badges_whitelist:vector::empty(),
            badges_receptions:vector::empty(),
        };

        let badge_collection_id = badge_collection.id.to_inner();
        let badge_list_collections = &mut badge_list.collections;
        vector::push_back(badge_list_collections,badge_collection_id);
        transfer::public_share_object(badge_collection);
    }



    public(package) fun create_badge(
        badge_collection:&mut BadgeCollection,
        ctx:&mut TxContext
        ):Badge{
        let reception = ctx.sender();
        assert!(check_if_badge_minted(badge_collection,reception),EAlreadyMinted);
        assert!(mint_validations(badge_collection,reception),ENotInWhitelist);

        let badge = Badge{
            id:object::new(ctx),
            name:badge_collection.name,
            description:badge_collection.description,
            collection_id:badge_collection.id.to_inner(),
        };
        let badge_receptions = &mut badge_collection.badges_receptions;
        vector::push_back(badge_receptions,reception);
        badge
    }

    public(package) fun add_receptions_to_whitelist(
        badge_collection:&mut BadgeCollection, 
        receptions:vector<address>
    ){
        let badge_whitelist = &mut badge_collection.badges_whitelist;
        let mut i = 0;
        while(i < receptions.length()){
            if(!vector::contains(badge_whitelist,&receptions[i])){
                vector::push_back(badge_whitelist,receptions[i]);
            };
            i = i + 1;
        }        
    }

    public fun check_if_badge_minted(badge_collection:&BadgeCollection, reception:address):bool{
        let badge_receptions = &badge_collection.badges_receptions;
        vector::contains(badge_receptions,&reception)
    }   

    public fun mint_validations(badge_collection:&BadgeCollection,reception:address):bool{
        let badge_whitelist = &badge_collection.badges_whitelist;
        !vector::contains(badge_whitelist,&reception)  
    }

    

    // ===== GETTERS =====

    public fun get_badge_id(badge:&Badge):ID{
       let id = badge.id.to_inner();
       id
    }

}

