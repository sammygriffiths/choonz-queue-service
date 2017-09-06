# # encoding: utf-8

# Inspec test for recipe choonz-queue-service::app

# The Inspec reference, with examples and extensive documentation, can be
# found at http://inspec.io/docs/reference/resources/

describe bash('node -v') do
  its('exit_status') { should eq 0 }
  its('stdout') { should match /8\.\d\.\d/ }
end
