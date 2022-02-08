#!/user/bin/python3
import os 

os.system('sudo apt install mysql-server')
os.system('~/mstat/database/initialize.sh')
os.system('~/mstat/database/create.sh')
