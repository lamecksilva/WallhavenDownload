### WallhavenDownload

App/Script to download RANDOM wallpapers from wallhaven.cc

#### Instalation

```sh
$ git clone https://github.com/lamecksilva/WallhavenDownload.git
$ cd WallhavenDownload/
$ npm i
```

#### Example

```sh
$ node index
https://wallhaven.cc/w/838gyk
Old File Deleted
Starting Download
Download done
```

#### OBS:

To run with cron in Arch Linux / Manjaro:

```sh
$ crontab -e
```

and in the editor, add:

```sh
*/1 * * * * cd /home/$USER/WallhavenDownload && /usr/bin/node index.js
```

> I Need put all my env variables in crontab file, and it works.  
> I need test for discover the necessary variable :)

Check the `WallhavenDownload/downloads` folder and voilà :stuck_out_tongue_winking_eye:

Feel free to make pr's and contact me

##### Thanks
