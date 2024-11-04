module nextart::member {
    use sui::display;
    use sui::package;
    use std::string::{String};
    use nextart::badge::{BadgeList,Badge,create_badge};

    public struct Member has key {
        id:UID,
        name:String,
        description:String,
        badges:vector<Badge>,
    }

    public struct MemberList has key, store {
        id:UID,
        members:vector<ID>,
    }

    const EBadgeAlreadyStaked:u64 = 0;
    const EBadgeNotStaked:u64 = 1;

    public struct MEMBER has drop{}
    public struct Admin has key{
        id:UID,
    }

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

    public fun mint_member_nft(member_list:&mut MemberList, name:String, description:String, ctx:&mut TxContext) {

        let sender_id = ctx.sender().to_id();

        if(!vector::contains(&member_list.members,&sender_id)){
            vector::push_back(&mut member_list.members,sender_id);
        };

        let member = Member{
            id:object::new(ctx),
            name:name,
            description:description,
            badges:vector::empty(),
        };

        transfer::transfer(member,ctx.sender());
        
    }

    public entry fun add_member_badge(
        _manager:&Admin, 
        badge_list:&mut BadgeList, 
        member:&mut Member, 
        badge_name:String, 
        badge_description:String, 
        badge_type:String,
        ctx:&mut TxContext
        ){
        let badge = create_badge(badge_list,badge_name, badge_description, badge_type,ctx);
        stake_badge_to_member(member,badge,ctx);
    }

    public entry fun stake_badge_to_member(member:&mut Member, badge:Badge, _ctx:&mut TxContext){
        let vector_badges = &mut member.badges;
        
        assert!(!vector::contains(vector_badges,&badge),EBadgeAlreadyStaked);
        vector::push_back(vector_badges,badge); 
    }

    public entry fun unstake_badge_from_member(member:&mut Member, badge:&Badge, ctx:&mut TxContext){
        let vector_badges = &mut member.badges;
        assert!(vector::contains(vector_badges,badge),EBadgeNotStaked);
        let unstaked_badge = vector::pop_back(vector_badges);
        transfer::public_transfer(unstaked_badge,ctx.sender());
    }
}   
