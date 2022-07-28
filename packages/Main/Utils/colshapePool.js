class ColshapeVolume {
    constructor(aColshape, aID){
        this._enterEvents = new Set();
        this._exitEvents = new Set();
        this.colshape = aColshape;
        this.id = aID;
    }

    InvokeEnterEvents(aPlayer) {
        this._enterEvents.forEach( async event => {
            await event(aPlayer, this.id);
        });
    }

    InvokeExitEvents(aPlayer){
        this._exitEvents.forEach( async event => {
            await event(aPlayer, this.id);
        });
    }

    AddEnterEvent(event){
        this._enterEvents.add(event);
        return this;
    }

    AddExitEvent(event){
        this._exitEvents.add(event);
        return this;
    }

    SetInteractive(interactionName, interactionData) {

        this.colshape.setVariable('interaction', interactionName);

        if(interactionData) this.colshape.setVariable('interaction.data', interactionData);
        
        return this;
    }
}

class ColshapeVolumePool {
    static Init(){
        //this.volumes = new Set();
        this.volumes = [];
    }

    static CreateCubeColshapeVolume(aPosition, aHeight, aDepth, aWidth){
        //let colshape = mp.colshapes.newCuboid(aPosition.x, aPosition.y, aPosition.z, aWidth, aDepth, aHeight);
        let colshape = mp.colshapes.newTube(aPosition.x, aPosition.y, aPosition.z, 2, 3);
        let def = new ColshapeVolume(colshape, this.volumes.length);
        this.AddNewVolume(def);
        return def;
    }

    static AddNewVolume(aDefenition){
        this.volumes.push(aDefenition)
    }

    static RemoveVolume(colId){
        delete this.volumes[colId];
    }

    static ColshapeEnter(aPlayer, aShape){
        this.volumes.forEach(def => {
            if(def.colshape === aShape){
                def.InvokeEnterEvents(aPlayer);
            }
        });
    }

    static ColshapeExit(aPlayer, aShape){
        this.volumes.forEach(def => {
            if(def.colshape === aShape){
                def.InvokeExitEvents(aPlayer);
            }
        });
    }

}

ColshapeVolumePool.Init();

exports.ColshapeVolumePool = ColshapeVolumePool;

mp.events.add("playerEnterColshape", function(aPlayer, aShape){
    ColshapeVolumePool.ColshapeEnter(aPlayer, aShape);
});

mp.events.add("playerExitColshape", function(aPlayer, aShape){
    ColshapeVolumePool.ColshapeExit(aPlayer, aShape);
});