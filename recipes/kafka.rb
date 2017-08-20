#
# Cookbook:: choonz-queue-service
# Recipe:: kafka
#
# Copyright:: 2017, The Authors, All Rights Reserved.

node.default['kafka']['init_style'] = 'upstart'
node.default['kafka']['automatic_start'] = true
node.default['kafka']['broker']['zookeeper.connect'] = 'zookeeper:2181'
node.default['kafka']['broker']['hostname'] = 'zookeeper'
include_recipe 'java'
include_recipe 'kafka'