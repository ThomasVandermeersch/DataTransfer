const {Client} = require('pg')
fs = require('fs')

async function createTables(client){
    
    // Teams :
        query = "Create TABLE teams_Crate (id varchar primary key, name varchar , createdAt timestamp, status varchar, solution varchar)"
        await client.query(query)
        console.log("Teams created")
    
    // Devices
        query = "Create TABLE devices_Crate (id varchar primary key, team_id varchar , name varchar)"
        await client.query(query)
        console.log("Devices created")
    
    // Smartdevices
        query = "Create TABLE smartdevices_Crate (id varchar primary key, team_id varchar , name varchar)"
        await client.query(query)
        console.log("Smartdevices created")
    
    // Measurements
        query = "Create TABLE measurements_Crate (id varchar primary key, device_id varchar, timestamp timestamp, updatedAt timestamp)"
        await client.query(query)
        console.log("Measurements created")
    
    // Smartmeasurements
        query = "Create TABLE smartmeasurements_Crate (id varchar primary key, smartdevice_id varchar, timestamp timestamp, updatedAt timestamp)"
        await client.query(query)
        console.log("Smartmeasurements created")
    
    // MeasurementsData
        query = "Create TABLE measurements_data_Crate (id varchar primary key, measurement_id varchar, type varchar, unit varchar, value real)"
        await client.query(query)
        console.log("Measurementsdata created")

    // SmartmeasurementsData
        query = "Create TABLE smartmeasurements_data_Crate (id varchar primary key, smartmeasurement_id varchar,  type varchar, unit varchar, value real)"
        await client.query(query)
        console.log("Smartmeasurementsdata created")
    
    // Assets
        query = "Create TABLE assets_Crate (id varchar primary key, team_id varchar, type_id varchar, name varchar, createdBy_id varchar, status varchar, parent_id varchar)"
        await client.query(query)
        console.log("Assets created")

    // Assettypes
        query = "Create TABLE assettypes_Crate (id varchar primary key, name varchar,status varchar,parent varchar)"
        await client.query(query)
        console.log("Assettypes created")
    
    // AssetsDevice
        query = "Create TABLE assetsdevices_Crate (asset_id varchar, device_id varchar)"
        await client.query(query)
        console.log("AssetsDevice created")

    // AssetsSmartdevices
        query = "Create TABLE assetssmartdevices_Crate (asset_id varchar, smartdevice_id varchar)"
        await client.query(query)
        console.log("AssetsSmartdevices created")
    
    // Assetstags
        query = "Create TABLE assetstags_Crate (id varchar primary key, asset_id varchar, linkedasset_id varchar, asset_name varchar )"
        await client.query(query)
        console.log("Assetstags created")
}

async function run(){
    const client = new Client({connectionString: 'postgresql://crate@localhost:5432/doc'})
    await client.connect()
    createTables(client)
}

run()