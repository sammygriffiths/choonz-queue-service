#
# Cookbook:: choonz-queue-service
# Recipe:: zookeeper
#
# Copyright:: 2017, The Authors, All Rights Reserved.

node.default['zookeeper']['service_style'] = 'upstart'
include_recipe 'zookeeper'
include_recipe 'zookeeper::service'