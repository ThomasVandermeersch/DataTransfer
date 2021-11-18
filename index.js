var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const {Client} = require('pg')


MongoClient.connect(url,async function(err, db) {
  if (err) throw err;
  var dbo = db.db("MongoDB");

  // Connexion to crate
  const client = new Client({connectionString: 'postgresql://crate@localhost:5432/doc'})
  await client.connect()
  //insertTeam(dbo, client, "1fc3f0oej.5b8")
  //insertMeasurements(dbo,client,["1fc3f0oej.5b8"] )
  //insertSmartMeasurements(dbo,client,["1fc3f0oej.5b8"] )
  insertAssetsandTypes(dbo,client,["1fc3f0oej.5b8"] )
});


function insertTeam (db,crate, teamID){
    
    // Insert team
    db.collection("teams").findOne({_id:teamID}, async function(err, result) {
        if (err) throw err;
        console.log(result)
        query = `INSERT INTO teams_Crate (id,name,createdAt,status,solution) VALUES('${result._id}','${result.name}',${JSON.stringify(result.createdAt).replace(/"/g,"'")},'${result.status}','${result.solution}')`
        //console.log(query)
        await crate.query(query)
        console.log("Team inserted")
      });
}

function insertDevice_SmartDevice(db,crate, teamIDs){
  // Insert Device
  db.collection("devices").find({ team: { $in: teamIDs} }).toArray(function(err,result){
    if(err) throw err;
    console.log(result)
    result.forEach( async(device) =>{
      query = `INSERT INTO devices_Crate (id,team_id,name) VALUES('${device._id}','${device.team}','${device.name}')`
      await crate.query(query)
    })
  })


  // Insert SmartDevice
  db.collection("smartdevices").find({ team: { $in: teamIDs} }).toArray(function(err,result){
    if(err) throw err;
    console.log(result)
    result.forEach( async(smartdevice) =>{
      query = `INSERT INTO smartdevices_Crate (id,team_id,name) VALUES('${smartdevice._id}','${smartdevice.team}','${smartdevice.name}')`
      await crate.query(query)
    })
  })
}


function insertSmartMeasurements(db, crate, teamIDs){
  db.collection("smartmeasurements").find({ "smartdevice.team": { $in: teamIDs} }).toArray(function(err,result){
    if(err) throw err;
    console.log(result)
    result.forEach( async(smartmeasurement) =>{
      // Insertion of the slartmeasurement
      query = `INSERT INTO smartmeasurements_Crate (id,smartdevice_id,timestamp,updatedAt) VALUES('${smartmeasurement._id}','${smartmeasurement.smartdevice.id}',${JSON.stringify(smartmeasurement.timestamp).replace(/"/g,"'")},${JSON.stringify(smartmeasurement.updatedAt).replace(/"/g,"'")})`
      //console.log(query)
      //await crate.query(query)
      
      smartmeasurement.measurements.forEach( async (smartmeasurementData,index) =>{
        query = `INSERT INTO smartmeasurements_data_Crate (id,smartmeasurement_id,type,unit,value) VALUES ('${smartmeasurement._id + index}','${smartmeasurement._id}','${smartmeasurementData.type}','${smartmeasurementData.unit}',${smartmeasurementData.value})`
        await crate.query(query)
      })
    })
  })
}



function insertMeasurements(db, crate, teamIDs){
  db.collection("measurements").find({ "device.team": { $in: teamIDs} }).toArray(function(err,result){
    if(err) throw err;
    console.log(result)
    result.forEach( async(measurement) =>{
      // Insertion of the measurement
      query = `INSERT INTO measurements_Crate (id,device_id,timestamp,updatedAt) VALUES('${measurement._id}','${measurement.device.id}',${JSON.stringify(measurement.timestamp).replace(/"/g,"'")},${JSON.stringify(measurement.updatedAt).replace(/"/g,"'")})`
      console.log(query)
      await crate.query(query)
      
      measurement.measurements.forEach( async (measurementData,index) =>{
        query = `INSERT INTO measurements_data_Crate (id,measurement_id,type,unit,value) VALUES ('${measurement._id + index}','${measurement._id}','${measurementData.type}','${measurementData.unit}',${measurementData.value})`
        await crate.query(query)
      })
    })
  })
}

function insertAssetsandTypes(db,crate,teamIDs){
  db.collection("assets").find({ "team": { $in: teamIDs} }).toArray(function(err,result){
    if(err) throw err;
    result.forEach( async(asset) =>{
      query = `INSERT INTO assets_Crate (id,team_id,type_id,name,createdBy_id,status,parent_id) VALUES ('${asset._id}','${asset.team}','${asset.type}','${asset.name}','${asset.createdBy}','${asset.status}','${asset.parent}')`
      //await crate.query(query)

      if(asset.devices){
        asset.devices.forEach(async (deviceID) =>{
          query = `INSERT INTO assetsdevices_Crate (asset_id, device_id) VALUES('${asset._id}','${deviceID}')`
          crate.query(query)
        })
      }

      if(asset.smartdevices){
        asset.smartdevices.forEach(async (smartdeviceID) =>{
          query = `INSERT INTO assetssmartdevices_Crate (asset_id,smartdevice_id) VALUES ('${asset._id}','${smartdeviceID}')`
          crate.query(query)
        })
      }

    })
  })

  db.collection("assettypes").find({ "team": { $in: teamIDs} }).toArray(function(err,result){
    if(err) throw err;
    result.forEach( async(assettype) =>{
      query = `INSERT INTO assettypes_Crate (id,name,status,parent) VALUES ('${assettype._id}','${assettype.name}','${assettype.status}','${assettype.parent}')`
      //await crate.query(query)
    })
  })
}