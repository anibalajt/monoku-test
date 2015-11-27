var app = angular.module('app', []);

app.controller('appController', function ($scope,$http) {
    $scope.listArtistas = []
    $scope.verModal = true;
    $scope.buscarArtista = function(name,limit,modal){
        if($scope.artista.length > 0){

            $scope.inputTop = "inputTop"

            $http.get("http://ws.audioscrobbler.com/2.0/?method=artist.search&artist="+name+"&limit="+limit+"&api_key=42f75f939105d2110d6a0daf27db431c&format=json").
            success(function(respuesta){
                if(!modal){
                    $scope.listArtistas = []
                }


                _.each(respuesta.results.artistmatches.artist,function(item){
                    var imagen = JSON.stringify(item.image[2]).replace('{"#text":"','').replace('","size":"large"}','');
                    $http.get("http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist="+item.name+"&api_key=42f75f939105d2110d6a0daf27db431c&format=json").
                    success(function(info){
                        $scope.relacionadoArtistas = []
                        if(modal){
                            $scope.relacionadoArtistas.push({
                                name:item.name,
                                image:imagen,
                                bioContent:info.artist.bio.content,
                                similar:info.artist.similar
                            })

                            $scope.modal($scope.relacionadoArtistas[0])
                        }else{
                            var bio = "", similar = "";
                            if(info.artist){
                                if(info.artist.bio){
                                bio = info.artist.bio.content
                                }
                                if(info.artist.similar){
                                    similar = info.artist.similar
                                }
                            }

                            $scope.listArtistas.push({
                                name:item.name,
                                image:imagen,
                                bioContent:bio,
                                similar:similar
                            })
                        }
                        if($scope.artista.length == 0){
                            $scope.listArtistas = []
                        }
                    })
                })
            });
        }else{
            $scope.inputTop = ""
            $scope.listArtistas = []
        }
    }
    $scope.modal = function(item){
        $scope.modalTranst = "modalTranst"
        document.body.scrollTop = 0
        $scope.disabled = "enabledScroll"
        $scope.verModal = false;
        $scope.imageModal = item.image
        $scope.nameModal = item.name
        $scope.bioModal = item.bioContent
        $scope.relacionado = item.similar

    }
});
