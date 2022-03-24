module.exports =  function follow(api,rootPath, relArray) {
    const root = api({
        method: 'GET',
        path: rootPath
    });
    //relArray = [{rel: 'employees', params: {size: pageSize}}]
    return relArray.reduce((root, arrayItem) => {
        const rel = typeof arrayItem === 'string' ? arrayItem : arrayItem.rel;
        return traversNext(root, rel, arrayItem);
    }, root);

    function traversNext (root, rel, arrayItem) {
        return root.then(response => {
            if(hasEmbeddedRel(response.entity, rel)){
                return response.entity._embedded[rel];
            }
            if(response.entity._links){
                return [];
            }
            if(typeof arrayItem === 'string'){
                return api({
                    method: 'GET',
                    path: response.entity._links[rel].href
                });
            }else{
                return api({
                    method: 'GET',
                    path: response.entity._links[rel].href,
                    params: arrayItem.params
                });
            }
        });
    }

    function hasEmbeddedRel (entity, rel) {
        return entity._embedded && entity._embedded.hasOwnProperty(rel);
    }

}