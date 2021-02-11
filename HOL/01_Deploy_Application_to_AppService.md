# Create Node.js Web Application
ไปที่ Visual Studio Code เลือกเมนู File > Open Folder

![](images/01/open_folder.png)

เลือก folder web ใน (workshop repository)/Files/01/web

![](images/01/open_folder_2.png)

Source Code ของ web project จะถูกแสดงใน visual studio code

![](images/01/web_project_files.png)

ไปที่ terminal รันคำสั่ง npm install เพื่อ restore packages

![](images/01/npm_install.png)

รันคำสั่ง npm start เพื่อรับ web project บนเครื่อง

![](images/01/npm_start.png)

ทดลองเปิด browser ไปที่ http://localhost:3000 

![](images/01/test_browse.png)

# Create App Service (Azure Portal)

ไปที่ Azuer Portal (https://portal.azure.com) login เพื่อเข้าใช้งาน

เลือกเมนูแฮมเบอเกอร์ทางซ้ายบน และเลือก Create Resource

![](images/01/create_resource_menu.png)

ที่ช่องค้นหา search คำว่า "App Service Plan"

![](images/01/search_app_plan.png)

ที่หน้า product detail ของ app service plan กดปุ่ม "Create"

![](images/01/create_app_plan.png)

ทำการใส่ค่าดังนี้

| Subscription | (subscription ที่ใช้ทำ workshop) |
| Resource Group | (resource group ที่ได้รับ assign ไว้ทำ workshop) |
| Name | workshop_apps_plan |
| Operating System | Linux |
| Region | Southeast Asia |

![](images/01/app_plan_info.png)

ที่ Pricing Tiers กด link "Change Size" เพื่อทำการเลือก Sizing ของ App Service Plan 

![](images/01/app_plan_tiers.png)


# Deploy Web Application to App Service


