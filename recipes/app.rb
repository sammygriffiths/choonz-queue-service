#
# Cookbook:: choonz-queue-service
# Recipe:: app
#
# Copyright:: 2017, The Authors, All Rights Reserved.

node.default['nodejs']['install_method'] = 'binary'
node.default['nodejs']['version'] = '8.4.0'
node.default['nodejs']['binary']['checksum'] = 'd12bf2389a6b57341528a33de62561edd7ef25c23fbf258d48758fbe3d1d8578'

include_recipe 'nodejs'

systemd_unit 'choonz-queue.service' do

    content ({
        "Unit" => {
            "Description" => "Choonz Queue Service",
            "After" => "network.target"
        },
        "Service" => {
            "User" => "kitchen",
            "ExecStart" => "/usr/local/bin/node /var/www/app/src/bin/www",
            "Restart" => "on-failure"
        },
        "Install" => {
            "WantedBy" => "multi-user.target"
        }
    })

    action [:create, :enable, :start]
end
