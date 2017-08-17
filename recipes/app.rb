#
# Cookbook:: choonz-queue-service
# Recipe:: app
#
# Copyright:: 2017, The Authors, All Rights Reserved.

node.default['nodejs']['install_method'] = 'binary'
node.default['nodejs']['version'] = '8.4.0'
node.default['nodejs']['binary']['checksum'] = 'd12bf2389a6b57341528a33de62561edd7ef25c23fbf258d48758fbe3d1d8578'

include_recipe "nodejs"
