//用户注册

Meteor.method("/user/register",function(obj){
    var user = User.findOne({phoneNum:obj.phoneNum});
    if(user){
        var status = {
            statusCode:0,
            desc:"账号已经被注册",
        }
        return status;
    }else{
        var status = {};
        var addUser = {
            phoneNum : obj.phoneNum,
            passWord : obj.passWord,
            userName: obj.userName,
        };
        var userId  = User.insert(addUser);
        var org = {
            organizationName:obj.organizationName
        }
        var orgId  = Organization.insert(org);
        if(userId && orgId){
            var profile = {
                isSecretary: true,
                userId: userId,
                organizationId: orgId,
                department:"administrators",
                role:"administrators",
                roleName: obj.userName,
            };
            var profileId  = Profile.insert(profile);
            if(profileId){
                status.statusCode=1;
                status.desc="账号注册成功";
            }
            else{
                status.statusCode=0;
                status.desc="账号注册失败";
            }
        }
        else{
            status.statusCode=0;
            status.desc="账号注册失败";
        }
        return status;
    }

},{
    url:"/user/register",
    httpMethod:"post",
    getArgsFromRequest: function (request) {
        var content = request.body;
        return [content];
    }
});

//用户登陆
Meteor.method("/user/login",function(obj){
    var phoneNum = obj.phoneNum;
    var passWord = obj.passWord;
    var user = User.findOne({phoneNum:phoneNum});
    var status = {};
    if(user){
        var userRight = User.findOne({phoneNum:phoneNum,passWord:passWord});
        if(userRight){
            status.statusCode=1;
            status.desc="登陆成功";
            status.userId=user._id;
            if(userRight.lastLoginTime){
                status.lastLoginTime = new Date().getTime();
                User.update({_id:userRight._id},{$set:{lastLoginTime:lastLoginTime}});
            }
            return status;
        }
        else{
            status.statusCode=0;
            status.desc="密码错误";
            return status;
        }
    }else{
        status.statusCode=0;
        status.desc="账号错误";
        return status;
    }
},{
    url:"/user/login",
    httpMethod:"post",
    getArgsFromRequest: function (request) {
        var content = request.body;
        return [content];
    }
});

//获取用户数据
Meteor.method("/updateData",function(obj){//userId,profileId(多个),orgId(多个),需要获取orgId
    var result = {};
    var allOrganization  = new Array();
    var allProject  = new Array();
    var allWell  = new Array();
    var allPole  = new Array();
    var allLightBox  = new Array();
    var allODF  = new Array();
    var allUpPoint  = new Array();
    var allWallHang  = new Array();
    var allJointBox  = new Array();
    var allOther  = new Array();
    var allConduit=new Array();
    var allCableSegment=new Array();
    var allCable=new Array();
    var allCoreRFID=new Array();
    var allJumpCable=new Array();
    var user = User.findOne({_id:obj.userId});
    var allProfile = Profile.find({userId:obj.userId}).fetch();
    var allOrgId = new Array();
    for(var i=0;i<allProfile.length;i++){
        var orgId = allProfile[i].organizationId;
        var project = Project.find({organizationId:orgId}).fetch();
        var oneAllOrg = Organization.find({_id:orgId}).fetch();
        for(var j=0;j<oneAllOrg.length;j++){
            allOrganization.push(oneAllOrg[j]);
        }
        allProject.push(project);
        allOrgId.push(orgId);
    }
    allWell = Well.find({orgId:{$in:allOrgId}}).fetch();
    allPole = Pole.find({orgId:{$in:allOrgId}}).fetch();
    allLightBox = LightBox.find({orgId:{$in:allOrgId}}).fetch();
    allODF = ODF.find({orgId:{$in:allOrgId}}).fetch();
    allUpPoint = UpPoint.find({orgId:{$in:allOrgId}}).fetch();
    allWallHang = WallHang.find({orgId:{$in:allOrgId}}).fetch();
    allJointBox = JointBox.find({orgId:{$in:allOrgId}}).fetch();
    allOther = Other.find({orgId:{$in:allOrgId}}).fetch();
    allConduit=Conduit.find({orgId:{$in:allOrgId}}).fetch();
    allCableSegment=CableSegment.find({orgId:{$in:allOrgId}}).fetch();
    allCable = Cable.find().fetch();
    allCoreRFID = CoreRFID.find().fetch();
    allJumpCable = JumpCable.find().fetch();
    result = {
        allWell:allWell,
        allPole:allPole,
        allLightBox:allLightBox,
        allODF:allODF,
        allUpPoint:allUpPoint,
        allWallHang:allWallHang,
        allJointBox:allJointBox,
        allOther:allOther,
        allProfile:allProfile,
        allProject:allProject,
        allOrganization:allOrganization,
        allConduit:allConduit,
        allCableSegment:allCableSegment,
        user:user,
        allCable:allCable,
        allCoreRFID:allCoreRFID,
        allJumpCable:allJumpCable,
    }
    return result;
    // if(obj.time == null){
    //        for(var i = 0;i<allProfile.length;i++){
    //            var organization = Organization.find({organizationId: allProfile[i].organizationId}).fetch();
    //            allOrganization.concat(organization);
    //        }
    //        for(var j = 0;j<allOrganization.length;j++){
    //            var project = Project.find({organizationId: allOrganization[j]._id}).fetch();
    //            allProject.concat(project);
    // 	}
    //        for(var k = 0;k<allProject.length;k++){
    //            var well = Well.find({projectId: allProject[k]._id}).fetch();
    //            allWell.concat(well);
    //            var pole = Pole.find({projectId: allProject[k]._id}).fetch();
    //            allPole.concat(pole);
    //            var lightBox = LightBox.find({projectId: allProject[k]._id}).fetch();
    //            allLightBox.concat(lightBox);
    //            var odf = ODF.find({projectId: allProject[k]._id}).fetch();
    //            allODF.concat(odf);
    //            var upPoint = UpPoint.find({projectId: allProject[k]._id}).fetch();
    //            allUpPoint.concat(upPoint);
    //            var wallHang = WallHang.find({projectId: allProject[k]._id}).fetch();
    //            allWallHang.concat(wallHang);
    //            var jointBox = JointBox.find({projectId: allProject[k]._id}).fetch();
    //            allJointBox.concat(jointBox);
    //            var other = Other.find({projectId: allProject[k]._id}).fetch();
    //            allOther.concat(other);
    //        }
    //        result.profile = allProfile;
    //        result.organization = allOrganization;
    //        result.project = allProject;
    //        result.well = allWell;
    //        result.pole = allPole;
    //        result.lihtBox = allLightBox;
    //        result.ODF = allODF;
    //        result.upPoint = allUpPoint;
    //        result.wallHang = allWallHang;
    //        result.jointBox = allJointBox;
    //        result.other = allOther;
    //        return result;
    // }
    //    else{
    //        for(var i = 0;i<allProfile.length;i++){
    //            var org = Organization.find({organizationId: allProfile[i].organizationId,addTime:{$gt:obj.time}}).fetch();
    //            allOrganization.concat(org);
    //        }
    //        for(var j = 0;j<allOrganization.length;j++){
    //            var project = Project.find({organizationId: allOrganization[j]._id,addTime:{$gt:obj.time}}).fetch();
    //            allProject.concat(project);
    //        }
    //        for(var k = 0;k<allProject.length;k++){
    //            var well = Well.find({projectId: allProject[k]._id,addTime:{$gt:obj.time}}).fetch();
    //            allWell.concat(well);
    //            var pole = Pole.find({projectId: allProject[k]._id,addTime:{$gt:obj.time}}).fetch();
    //            allPole.concat(pole);
    //            var lightBox = LightBox.find({projectId: allProject[k]._id,addTime:{$gt:obj.time}}).fetch();
    //            allLightBox.concat(lightBox);
    //            var odf = ODF.find({projectId: allProject[k]._id,addTime:{$gt:obj.time}}).fetch();
    //            allODF.concat(odf);
    //            var upPoint = UpPoint.find({projectId: allProject[k]._id,addTime:{$gt:obj.time}}).fetch();
    //            allUpPoint.concat(upPoint);
    //            var wallHang = WallHang.find({projectId: allProject[k]._id,addTime:{$gt:obj.time}}).fetch();
    //            allWallHang.concat(wallHang);
    //            var jointBox = JointBox.find({projectId: allProject[k]._id,addTime:{$gt:obj.time}}).fetch();
    //            allJointBox.concat(jointBox);
    //            var other = Other.find({projectId: allProject[k]._id,addTime:{$gt:obj.time}}).fetch();
    //            allOther.concat(other);
    //        }
    //        result.profile = allProfile;
    //        result.organization = allOrganization;
    //        result.project = allProject;
    //        result.well = allWell;
    //        result.pole = allPole;
    //        result.lihtBox = allLightBox;
    //        result.ODF = allODF;
    //        result.upPoint = allUpPoint;
    //        result.wallHang = allWallHang;
    //        result.jointBox = allJointBox;
    //        result.other = allOther;
    //        return result;
    // }
},{
    url:"/updateData",
    httpMethod:"post",
    getArgsFromRequest: function (request) {
        var content = request.body;
        return [content];
    }
});

//创建项目
Meteor.method("/project/create",function(obj){
    var project = {
        name: obj.name,
        states: obj.states,
        approveResult: obj.approveResult,
        addTime: obj.addTime,
        createMember:obj.userId,
        organizationId:obj.organizationId,
    };
    var _id = Project.insert(project);//返回的是Project中的_id
    var result = {
        _id:_id
    }
    return result;
},{
    url:"/project/create",
    httpMethod:"post",
    getArgsFromRequest: function (request) {
        var content = request.body;
        return [content];
    }
});

//改变项目状态
Meteor.method("/project/status",function(obj){//obj.phoneNum

    var res = Project.update({_id:obj.projectId},{$set:{"states":obj.states}});

    var result = {
        res:res
    }
    return result;
},{
    url:"/project/status",
    httpMethod:"post",
    getArgsFromRequest: function (request) {
        var content = request.body;
        return [content];
    }
});


//添加项目成员
Meteor.method("/project/addMembers",function(obj){
    var result = {};
    var user = User.findOne({phoneNum:obj.phoneNum});
    var userId;
    if(user){
        var organizationId = obj.organizationId;
        var department = obj.department;
        var role = obj.role;
        userId = user._id;
        var profile = Profile.findOne({organizationId:organizationId,userId:userId});
        // console.log(profile);
        if(profile){
            result.statusCode = 2;
            result.desc = "用户已经被邀请";
            result.profileId = profile.profileId;
            result.userId = profile.userId;
            result.organizationId = profile.organizationId;
            return result;


        }else{//user存在.profile不存在
            var newProfile = {
                isSecretary:false,
                userId:userId,
                organizationId: obj.organizationId,
                department:obj.department,
                role:obj.role,
                roleName: obj.userName,
            }
            var profileId = Profile.insert(newProfile);
            result.statusCode = 1;
            result.desc="用户邀请成功,该用户默认登录密码为123456";
            result.profileId = profileId;
            result.userId = userId;
            result.organizationId = obj.organizationId;
            return result;
        }
    }
    else{
        var inviteUser = {
            phoneNum : obj.phoneNum,
            passWord : "123456",
            userName: obj.userName,
        };
        userId  = User.insert(inviteUser);
    }
    var profile = {
        isSecretary: false,
        userId: userId,
        organizationId: obj.organizationId,
        department:obj.department,
        role:obj.role,
        roleName: obj.userName,
    };
    var profileId  = Profile.insert(profile);
    if(profileId){
        result.statusCode=1;
        result.desc="用户邀请成功,该用户默认登录密码为123456";
        result.profileId = profileId;
        result.userId = userId;
        result.organizationId = profile.organizationId;
    }
    else{
        result.statusCode=0;
        result.desc="用户邀请失败,请重试!";
    }
    return result;
},{
    url:"/project/addMembers",
    httpMethod:"post",
    getArgsFromRequest: function (request) {
        var content = request.body;
        return [content];
    }
});

//创建光缆
Meteor.method("/addCable",function(obj){

    var cable = {
        name: obj.name,
        stand: obj.stand,
        type: obj.type,
        addTime: obj.addTime,
    };
    var _id = Cable.insert(cable);//返回的是Cable中的_id
    var result = {
        _id:_id
    }
    return result;
},{
    url:"/addCable",
    httpMethod:"post",
    getArgsFromRequest: function (request) {
        var content = request.body;
        return [content];
    }
});

//添加标记点
Meteor.method("/annotation/add",function(obj){

    var result = {};
    var annotationId;
    var type = obj.addType;
    var conduit=obj.conduit;
    var cableSegment=obj.cableSegment;



    if(type == "WELL"){
        var well = {
            name: obj.name,
            stand: obj.stand,
            latitude: obj.latitude,
            longitude: obj.longitude,
            projectId: obj.projectId,
            projectName: obj.projectName,
            addTime: obj.addTime,
            orgId:obj.orgId
        };
        annotationId =  Well.insert(well);
    }
    if(type == "POLE"){
        var pole = {
            name: obj.name,
            high: obj.high,
            style: obj.style,
            latitude: obj.latitude,
            longitude: obj.longitude,
            projectId: obj.projectId,
            projectName: obj.projectName,
            addTime: obj.addTime,
            orgId:obj.orgId
        };
        annotationId = Pole.insert(pole);
    }
    if(type == "UPPOINT"){
        var upPoint = {
            name: obj.name,
            latitude: obj.latitude,
            longitude: obj.longitude,
            projectId: obj.projectId,
            projectName: obj.projectName,
            addTime: obj.addTime,
            orgId:obj.orgId
        };
        annotationId = UpPoint.insert(upPoint);
    }
    if(type == "WALLHANG"){
        var wallHang = {
            name: obj.name,
            latitude: obj.latitude,
            longitude: obj.longitude,
            projectId: obj.projectId,
            projectName: obj.projectName,
            addTime: obj.addTime,
            orgId:obj.orgId
        };
        annotationId = WallHang.insert(wallHang);
    }
    if(type == "LIGHTBOX"){
        var lightBox = {
            name: obj.name,
            stand: obj.stand,
            level: obj.level,
            latitude: obj.latitude,
            longitude: obj.longitude,
            projectId: obj.projectId,
            projectName: obj.projectName,
            addTime: obj.addTime,
            orgId:obj.orgId
        };
        annotationId = LightBox.insert(lightBox);
    }
    if(type == "ODF"){
        var odf = {
            name: obj.name,
            stand: obj.stand,
            latitude: obj.latitude,
            longitude: obj.longitude,
            projectId: obj.projectId,
            projectName: obj.projectName,
            addTime: obj.addTime,
            orgId:obj.orgId
        };
        annotationId = ODF.insert(odf);
    }
    if(type == "JOINTBOX"){
        var jointBox = {
            name: obj.name,
            stand: obj.stand,
            latitude: obj.latitude,
            longitude: obj.longitude,
            projectId: obj.projectId,
            projectName: obj.projectName,
            addTime: obj.addTime,
            orgId:obj.orgId
        };
        annotationId = JointBox.insert(jointBox);
    }
    if(type == "OTHER"){
        var other = {
            name: obj.name,
            latitude: obj.latitude,
            longitude: obj.longitude,
            projectId: obj.projectId,
            projectName: obj.projectName,
            addTime: obj.addTime,
            orgId:obj.orgId
        };
        annotationId = Other.insert(other);
    }



    var conduitArray = new Array();
    for(var i = 0;i<conduit.length;i++){
        var tempConduit = {
            name:conduit[i].name,
            stand:conduit[i].stand,
            type:conduit[i].type,
            length:conduit[i].length,
            holeNumber:conduit[i].holeNumber,
            startPointName:conduit[i].startPointName,
            startPointType:conduit[i].startPointType,
            startLatitude:conduit[i].startLatitude,
            startLongitude:conduit[i].startLongitude,
            startPointId:conduit[i].startPointId,
            endPointId:annotationId,
            endPointName:conduit[i].endPointName,
            endPointType:conduit[i].endPointType,
            endLatitude:conduit[i].endLatitude,
            endLongitude:conduit[i].endLongitude,
            addTime:conduit[i].addTime,
            projectId:conduit[i].projectId,
            orgId:conduit[i].orgId
        };

        var conduitId = Conduit.insert(tempConduit);
        tempConduit._id = conduitId;
        conduitArray.push(tempConduit);
    }



    var cableSegmentArray = new Array();
    for(var j = 0;j<cableSegment.length;j++){
        var tempCableSegment = {
            cableName:cableSegment[j].cableName,
            conduitName:cableSegment[j].conduitName,
            useHole:cableSegment[j].useHole,
            useSubHole:cableSegment[j].useSubHole,
            length:cableSegment[j].length,
            startPointName:cableSegment[j].startPointName,
            startPointType:cableSegment[j].startPointType,
            startLatitude:cableSegment[j].startLatitude,
            startPointId:cableSegment[j].startPointId,
            startLongitude:cableSegment[j].startLongitude,
            endPointId:annotationId,
            endPointName:cableSegment[j].endPointName,
            endPointType:cableSegment[j].endPointType,
            endLatitude:cableSegment[j].endLatitude,
            endLongitude:cableSegment[j].endLongitude,
            addTime:cableSegment[j].addTime,
            projectId:cableSegment[j].projectId,
            orgId:cableSegment[j].orgId
        };
        var cableSegmentId = CableSegment.insert(tempCableSegment);
        tempCableSegment._id = cableSegmentId;
        cableSegmentArray.push(tempCableSegment);
    }


    result.annotationId = annotationId;
    result.conduitArray = conduitArray;
    result.cableSegmentArray = cableSegmentArray;

    return result;
},{
    url:"/annotation/add",
    httpMethod:"post",
    getArgsFromRequest: function (request) {
        var content = request.body;
        return [content];
    }
});

//修改标记点
Meteor.method("/annotation/update",function(obj){

    var result={};
    var type = obj.updateType;

    var allConduit=new Array();
    var allCableSegment=new Array();

    var addConduit = obj.addConduit;
    var addCableSegment = obj.addCabelSegment;

    var removeConduit = obj.removeConduit;
    var removeCableSegment = obj.removeCableSegment;

    var allStartConduit = Conduit.find({"startPointId":obj._id}).fetch();
    var allEndConduit = Conduit.find({"endPointId":obj._id}).fetch();
    var allStartCableSegment=CableSegment.find({"startPointId":obj._id}).fetch();
    var allEndCableSegment=CableSegment.find({"endPointId":obj._id}).fetch();

    //删除管道
    for(var a = 0;a<removeConduit.length;a++){
        if(removeConduit[a]._id){
            var  conduit= Conduit.remove({_id:removeConduit[a]._id});
        }
        else {
            var conduit = Conduit.remove({_id: removeConduit[a]});
        }
    }

    //删除光缆
    for(var  b = 0;b<removeCableSegment.length;b++){
        if(removeCableSegment[b]._id){
            var  cablesegment= CableSegment.remove({_id:removeCableSegment[b]._id});
        }
        else {
            var cablesegment = Conduit.remove({_id: removeCableSegment[b]});
        }
    }


    //更新管道表
    for(var i=0;i<allStartConduit.length;i++){
        Conduit.update({_id:allStartConduit[i]._id},{$set:{"startLatitude":obj.latitude,"startLongitude":obj.longitude}});
    }
    for(var j=0;j<allEndConduit.length;j++){
        Conduit.update({_id:allEndConduit[j]._id},{$set:{"endLatitude":obj.latitude,"endLongitude":obj.longitude}});
    }

    //更新光缆表
    for(var k=0;k<allStartCableSegment.length;k++){
        CableSegment.update({_id:allStartCableSegment[k]._id},{$set:{"startLatitude":obj.latitude,"startLongitude":obj.longitude}});
    }
    for(var l=0;l<allEndCableSegment.length;l++){
        Conduit.update({_id:allEndCableSegment[l]._id},{$set:{"endLatitude":obj.latitude,"endLongitude":obj.longitude}});
    }


    if(type == "WELL"){
        Well.update({_id:obj._id},{$set:{"stand":obj.stand,"latitude":obj.latitude,"longitude":obj.longitude}});
    }
    if(type == "POLE"){
        Pole.update({_id:obj._id},{$set:{"high":obj.high,"style":obj.style,"latitude":obj.latitude,"longitude":obj.longitude}});
    }
    if(type == "UPPOINT"){
        UpPoint.update({_id:obj._id},{$set:{"latitude":obj.latitude,"longitude":obj.longitude}});
    }
    if(type == "WALLHANG"){
        WallHang.update({_id:obj._id},{$set:{"latitude":obj.latitude,"longitude":obj.longitude}});
    }
    if(type == "LIGHTBOX"){
        LightBox.update({_id:obj._id},{$set:{"stand":obj.stand,"level":obj.level,"latitude":obj.latitude,"longitude":obj.longitude}});
    }
    if(type == "ODF"){
        ODF.update({_id:obj._id},{$set:{"stand":obj.stand,"latitude":obj.latitude,"longitude":obj.longitude}});
    }
    if(type == "JOINTBOX"){
        JointBox.update({_id:obj._id},{$set:{"stand":obj.stand,"latitude":obj.latitude,"longitude":obj.longitude}});
    }
    if(type == "OTHER"){
        Other.update({_id:obj._id},{$set:{"latitude":obj.latitude,"longitude":obj.longitude}});
    }

    //添加管道
    var conduitArray = new Array();
    for(var i = 0;i<addConduit.length;i++){
        var tempConduit = {
            name:addConduit[i].name,
            stand:addConduit[i].stand,
            type:addConduit[i].type,
            length:addConduit[i].length,
            holeNumber:addConduit[i].holeNumber,
            startPointName:addConduit[i].startPointName,
            startPointType:addConduit[i].startPointType,
            startLatitude:addConduit[i].startLatitude,
            startLongitude:addConduit[i].startLongitude,
            startPointId:addConduit[i].startPointId,
            endPointId:addConduit[i].endPointId,
            endPointName:addConduit[i].endPointName,
            endPointType:addConduit[i].endPointType,
            endLatitude:addConduit[i].endLatitude,
            endLongitude:addConduit[i].endLongitude,
            addTime:addConduit[i].addTime,
            projectId:addConduit[i].projectId,
            orgId:addConduit[i].orgId
        };

        var conduitId = Conduit.insert(tempConduit);
        tempConduit._id = conduitId;
        conduitArray.push(tempConduit);
    }

    //添加光缆
    var cableSegmentArray = new Array();
    for(var j = 0;j<addCableSegment.length;j++){
        var tempCableSegment = {
            cableName:addCableSegment[j].cableName,
            conduitName:addCableSegment[j].conduitName,
            useHole:addCableSegment[j].useHole,
            useSubHole:addCableSegment[j].useSubHole,
            length:addCableSegment[j].length,
            startPointName:addCableSegment[j].startPointName,
            startPointType:addCableSegment[j].startPointType,
            startLatitude:addCableSegment[j].startLatitude,
            startPointId:addCableSegment[j].startPointId,
            startLongitude:addCableSegment[j].startLongitude,
            endPointId:addCableSegment[j].endPointId,
            endPointName:addCableSegment[j].endPointName,
            endPointType:addCableSegment[j].endPointType,
            endLatitude:addCableSegment[j].endLatitude,
            endLongitude:addCableSegment[j].endLongitude,
            addTime:addCableSegment[j].addTime,
            projectId:addCableSegment[j].projectId,
            orgId:addCableSegment[j].orgId
        };
        var cableSegmentId = CableSegment.insert(tempCableSegment);
        tempCableSegment._id = cableSegmentId;
        cableSegmentArray.push(tempCableSegment);
    }

    result.annotationId = obj._id;
    result.conduitArray = conduitArray;
    result.cableSegmentArray = cableSegmentArray;
    return result;
},{
    url:"/annotation/update",
    httpMethod:"post",
    getArgsFromRequest: function (request) {
        var content = request.body;
        return [content];
    }
});

//删除标记点
Meteor.method("/annotation/delete",function(obj){
    var _id = obj._id;
    var type = obj.type;
    var conduitlistIds=obj.conduitlistIds;
    var cablesegmentlistIds=obj.cablesegmentlistIds;

    for(var i = 0;i<conduitlistIds.length;i++){
        var  conduit= Conduit.remove({_id:conduitlistIds[i]});
    }
    for(var i=0;i<cablesegmentlistIds.length;i++){
        var  cablesegment= CableSegment.remove({_id:cablesegmentlistIds[i]});
    }

    if(type == "WELL"){
        var res  = Well.remove({_id:_id});

        var result = {
            res:res,
            conduit:conduit,
            cablesegment:cablesegment

        }
        return result;
    }
    if(type == "POLE"){
        var res  = Pole.remove({_id:_id});
        var result = {
            res:res,
            conduit:conduit,
            cablesegment:cablesegment
        }
        return result;
    }
    if(type == "UPPOINT"){
        var res  = UpPoint.remove({_id:_id});
        var result = {
            res:res,
            conduit:conduit,
            cablesegment:cablesegment
        }
        return result;
    }
    if(type == "WALLHANG"){
        var res  = WallHang.remove({_id:_id});
        var result = {
            res:res,
            conduit:conduit,
            cablesegment:cablesegment
        }
        return result;
    }
    if(type == "LIGHTBOX"){
        var res  = LightBox.remove({_id:_id});
        var result = {
            res:res,
            conduit:conduit,
            cablesegment:cablesegment
        }
        return result;
    }
    if(type == "ODF"){
        var res  = ODF.remove({_id:_id});
        var result = {
            res:res,
            conduit:conduit,
            cablesegment:cablesegment
        }
        return result;
    }
    if(type == "JOINTBOX"){
        var res  = JointBox.remove({_id:_id});
        var result = {
            res:res,
            conduit:conduit,
            cablesegment:cablesegment
        }
        return result;
    }
    if(type == "OTHER"){
        var res  = Other.remove({_id:_id});
        var result = {
            res:res,
            conduit:conduit,
            cablesegment:cablesegment
        }
        return result;
    }




},{
    url:"/annotation/delete",
    httpMethod:"post",
    getArgsFromRequest: function (request) {
        var content = request.body;
        return [content];
    }
});


//创建RFID
Meteor.method("/addRFID",function(obj){
    var coreRFID = {
        rfid:obj.rfid,
        lightBox:obj.lightBox,
        hardBox:obj.hardBox,
        opticalCore:obj.opticalCore,
        addTime:obj.addTime,
    };
    var _id = CoreRFID.insert(coreRFID);
    var result = {
        _id:_id
    }
    return result;
},{
    url:"/addRFID",
    httpMethod:"post",
    getArgsFromRequest: function (request) {
        var content = request.body;
        return [content];
    }
});

//记录跳纤信息
Meteor.method("/jumpCable",function(obj){
    var jumpCable = {
        startRFID:obj.startRFID,
        startLightBox:obj.startLightBox,
        starthardBox:obj.starthardBox,
        startOpticalCore:obj.startOpticalCore,
        endRFID:obj.endRFID,
        endLightBox:obj.endLightBox,
        endHardBox:obj.endHardBox,
        endOpticalCore:obj.endOpticalCore,
        userId:obj.userId,
        userName:obj.userName,
        addTime:obj.addTime,
    };
    var _id = JumpCable.insert(jumpCable);
    var result = {
        _id:_id
    }
    return result;
},{
    url:"/jumpCable",
    httpMethod:"post",
    getArgsFromRequest: function (request) {
        var content = request.body;
        return [content];
    }
});