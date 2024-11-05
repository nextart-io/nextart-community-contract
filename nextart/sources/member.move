module nextart::member {
    use sui::display;
    use sui::package;
    use sui::vec_map::{Self,VecMap};
    use std::string::{String};
    use nextart::badge::{BadgeCollection,Badge,BadgeList,create_badge,get_badge_id,create_badge_collection};

    // ===== ERRORS =====
    const EBadgeAlreadyStaked:u64 = 0;
    const EBadgeNotStaked:u64 = 1;

    // ===== STRUCTS =====

    public struct Member has key {
        id:UID,
        name:String,
        description:String,
        badges:VecMap<ID,Badge>,
    }

    public struct MemberList has key, store {
        id:UID,
        members:vector<ID>,
    }   

    public struct MEMBER has drop{}

    public struct Admin has key{
        id:UID,
    }

    // ===== FUNCTIONS =====

    fun init(
        otw:MEMBER,
        ctx:&mut TxContext,
    ){
        let deployer = package::claim(otw,ctx);
        let sender = ctx.sender();
        let mut display = display::new<Member>(&deployer,ctx);

        let member_list = MemberList{
            id:object::new(ctx),
            members:vector::empty(),
        };

        display.add(
            b"image_url".to_string(),
            b"".to_string()
        );

        let admin = Admin{
            id:object::new(ctx),
        };

        transfer::public_transfer(display,sender);
        transfer::public_transfer(deployer,sender);
        transfer::share_object(member_list);
        transfer::transfer(admin,sender);
    }

    

    public fun do_create_badge_collection(
        _manager:&Admin,
        badge_list:&mut BadgeList,
        name:String,
        description:String,
        ctx:&mut TxContext
    ){
        create_badge_collection(
            badge_list,
            name,
            description,
            ctx
        );
    }

    public entry fun do_mint_badge(
        badge_collection:&mut BadgeCollection,
        member:&mut Member,
        ctx:&mut TxContext
        ){
        let badge = create_badge(
            badge_collection,
            ctx
            );
        stake_badge_to_member(member,badge,ctx);
    }

    public entry fun do_mint_member(
        member_list:&mut MemberList, 
        name:String, 
        description:String, 
        ctx:&mut TxContext
    ) {

        let sender_id = ctx.sender().to_id();

        if(!vector::contains(&member_list.members,&sender_id)){
            vector::push_back(&mut member_list.members,sender_id);
        };

        let member = Member{
            id:object::new(ctx),
            name:name,
            description:description,
            badges:vec_map::empty<ID,Badge>(),
        };

        transfer::transfer(member,ctx.sender());        
    }

    public entry fun stake_badge_to_member(member:&mut Member, badge:Badge, _ctx:&mut TxContext){
        let vector_badges = &mut member.badges;
        let badge_id = get_badge_id(&badge);
        assert!(!vec_map::contains(vector_badges,&badge_id),EBadgeAlreadyStaked);
        vec_map::insert(vector_badges,badge_id,badge); 
    }

    public entry fun unstake_badge_from_member(member:&mut Member, badge:&Badge, ctx:&mut TxContext){
        let vector_badges = &mut member.badges;     
        let badge_id = get_badge_id(badge);
        assert!(vec_map::contains(vector_badges,&badge_id),EBadgeNotStaked);
        let (_unstaked_badge_id,unstaked_badge) = vec_map::remove(vector_badges,&badge_id);
        
        transfer::public_transfer(unstaked_badge,ctx.sender());
    }
}   
