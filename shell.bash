#!/bin/bash

app_name="kappashiro-bot"
host="kevin@127.0.0.1"

image_id="$(ssh "$host" docker images --filter=reference="$app_name" --format "{{.ID}}")"

echo "$1 $2"

run_container() {
    docker run \
        --log-opt max-size=50m \
        --log-opt max-file=5 \
        -e TZ=America/Sao_Paulo \
        "$env" \
        "$cond" \
        --name="$app_name" \
        -p 5555:5555 \
        -d \
        --restart=unless-stopped "$app_name"
}

clear_image() {
    docker rmi "$image_id"
}

if [ "$1" == "local" ]; then

    env="-e ENV_PROD=0"
    cond="--net='host'"

    if [ "$2" == "deploy" ]; then
        docker build -t "$app_name" .
        docker stop "$app_name"
        docker rm "$app_name"
        run_container
    fi

    if [ "$2" == "logs" ]; then
        docker logs -f "$app_name"
    fi

fi

if [ "$1" == "remote" ]; then

    env="-e ENV_PROD=1"
    cond="--net='host'"

    if [ "$2" == "deploy" ]; then
        ssh -tt "$host" "mkdir -p $app_name && cd $app_name && sudo chmod 777 * -R"
        rsync --progress --exclude-from '.deployignore' -avz -e "ssh" . "$host:$app_name"
        ssh -tt "$host" "cd $app_name && docker build -t $app_name ."
        ssh -tt "$host" "cd $app_name && docker stop $app_name"
        ssh -tt "$host" "cd $app_name && docker rm $app_name"
        ssh -tt "$host" "cd $app_name && $(run_container)"
        ssh -tt "$host" "docker rmi $(echo "$image_id")"
    fi

    if [ "$2" == "logs" ]; then
        ssh -tt "$host" "docker logs -f $app_name"
    fi

fi
