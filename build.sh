#! /bin/bash

set -e
trap 'catch $? $LINENO' EXIT
catch() {
  echo "kabummm!!!"
  if [ "$1" != "0" ]; then
    echo "War wohl nicht so gut. Fehler $1, guckst du $2"
  fi
}

if [ "$TRAVIS_BRANCH" = "master" ]
then
  #export DOCKERTAG=latest
  export DOCKERTAG="master_v$( jq -r '.version' package.json )_$TRAVIS_COMMIT"
else
  # replace special characters in branch name for docker tag
  export DOCKERTAG="$( echo $TRAVIS_BRANCH | tr -s '[:punct:]' '-' | tr -s '[:upper:]' '[:lower:]' )_v$( jq -r '.version' package.json )_$TRAVIS_COMMIT"
fi
echo "DOCKERTAG: $DOCKERTAG"

function buildandpush {
  # build container default theme
  docker build -t schulcloud/schulcloud-client:$DOCKERTAG -t schulcloud/schulcloud-client:$GIT_SHA .

  # Log in to the docker CLI
  echo "$MY_DOCKER_PASSWORD" | docker login -u "$DOCKER_ID" --password-stdin

  # take those images and push them up to docker hub
  docker push schulcloud/schulcloud-client:$DOCKERTAG
  docker push schulcloud/schulcloud-client:$GIT_SHA

  if [[ "$TRAVIS_BRANCH" = "master" || release* && "$TRAVIS_PULL_REQUEST" = "false" ]]
  then
  # build container n21 theme
  docker build -t schulcloud/schulcloud-client-n21:$DOCKERTAG -t schulcloud/schulcloud-client-n21:$GIT_SHA -f Dockerfile.n21 .
  docker push schulcloud/schulcloud-client-n21:$DOCKERTAG
  docker push schulcloud/schulcloud-client-n21:$GIT_SHA

  # build container open theme
  docker build -t schulcloud/schulcloud-client-open:$DOCKERTAG -t schulcloud/schulcloud-client-open:$GIT_SHA -f Dockerfile.open .
  docker push schulcloud/schulcloud-client-open:$DOCKERTAG
  docker push schulcloud/schulcloud-client-open:$GIT_SHA

  # build container brb theme
  docker build -t schulcloud/schulcloud-client-brb:$DOCKERTAG -t schulcloud/schulcloud-client-brb:$GIT_SHA -f Dockerfile.brb .
  docker push schulcloud/schulcloud-client-brb:$DOCKERTAG
  docker push schulcloud/schulcloud-client-brb:$GIT_SHA

    # build container thr theme
  docker build -t schulcloud/schulcloud-client-thr:$DOCKERTAG -t schulcloud/schulcloud-client-thr:$GIT_SHA -f Dockerfile.thr .
  docker push schulcloud/schulcloud-client-thr:$DOCKERTAG
  docker push schulcloud/schulcloud-client-thr:$GIT_SHA
  fi
}

# write version file
printf "%s\n%s\n%s" $TRAVIS_COMMIT $TRAVIS_BRANCH $TRAVIS_COMMIT_MESSAGE > ./version


openssl aes-256-cbc -K $encrypted_839866e404c6_key -iv $encrypted_839866e404c6_iv -in travis_rsa.enc -out travis_rsa -d


if [[ "$TRAVIS_BRANCH" = "master" && "$TRAVIS_PULL_REQUEST" = "false" ]]
then
  buildandpush
elif [ "$TRAVIS_BRANCH" = "develop" ]
then
  buildandpush
elif [[ $TRAVIS_BRANCH = release* || $TRAVIS_BRANCH = hotfix* ]]
then
  buildandpush
else
  echo "Nix wird gebaut"
fi

exit 0
