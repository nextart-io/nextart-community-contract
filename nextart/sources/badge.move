module nextart::badge {
    use std::string::{String};
    use sui::{
        table::{Self,Table},
        display,
        package,
    };

    const EAlreadyMinted:u64 = 0;
    const ENotInWhitelist:u64 = 1;
    public struct Badge has key, store {
        id: UID,
        name:String,
        description:String,
        badge_type:String,
    }

    public struct BadgeList has key, store {
        id:UID,
        badges_whitelist_table:Table<String,vector<address>>,
        badges_reception_table:Table<String,vector<address>>,
    }

    public struct BADGE has drop{}

     fun init(otw:BADGE, ctx:&mut TxContext){

        let deployer = package::claim(otw,ctx);
        let sender = ctx.sender();
        let mut display = display::new<Badge>(&deployer,ctx);

        display.add(
            b"image_url".to_string(),
            b"".to_string()
        );

        let badge_list = BadgeList{
            id:object::new(ctx),
            badges_whitelist_table:table::new<String,vector<address>>(ctx),
            badges_reception_table:table::new<String,vector<address>>(ctx),
        };

        transfer::public_share_object(badge_list);
        transfer::public_transfer(display,sender);
        transfer::public_transfer(deployer,sender);
    }



    public(package) fun create_badge(badge_list:&mut BadgeList, name:String, description:String, badge_type:String, ctx:&mut TxContext):Badge{
        let reception = ctx.sender();
        assert!(check_if_badge_minted(badge_list,name,reception),EAlreadyMinted);
        assert!(mint_validations(badge_list,name,reception),ENotInWhitelist);
        let badge = Badge{
            id:object::new(ctx),
            name,
            description,
            badge_type,
        };
        let badge_reception_table = &mut badge_list.badges_reception_table;
        let badge_reception_table_vector = &mut badge_reception_table[name];
        vector::push_back(badge_reception_table_vector,reception);
        badge
    }

    public(package) fun add_receptions_to_whitelist(badge_list:&mut BadgeList, badge_name:String, receptions:vector<address>){
        let badge_whitelist_table = &mut badge_list.badges_whitelist_table;
        let badge_whitelist_table_vector = &mut badge_whitelist_table[badge_name];
        let mut i = 0;
        while(i < receptions.length()){
            if(!vector::contains(badge_whitelist_table_vector,&receptions[i])){
                vector::push_back(badge_whitelist_table_vector,receptions[i]);
            };
            i = i + 1;
        }        
    }

    public fun check_if_badge_minted(badge_list:&BadgeList, badge_name:String, reception:address):bool{
        let badge_reception_table = &badge_list.badges_reception_table;
        let badge_reception_table_vector = badge_reception_table[badge_name];
        vector::contains(&badge_reception_table_vector,&reception)
    }

    public fun mint_validations(badge_list:&BadgeList, badge_name:String, reception:address):bool{
        let badge_whitelist_table = &badge_list.badges_whitelist_table;
        let badge_whitelist_table_vector = badge_whitelist_table[badge_name];
        !vector::contains(&badge_whitelist_table_vector,&reception)
    }

    

    //=== Getter ===

    public fun get_badge_id(badge:&Badge):ID{
       let id = badge.id.to_inner();
       id
    }

}

