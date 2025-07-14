require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-qonversion"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-qonversion
                   DESC
  s.homepage     = "https://github.com/qonversion/react-native-sdk"
  # brief license entry:
  s.license      = "MIT"
  # optional - use expanded license entry instead:
  # s.license    = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "Qonversion" => "hi@qonversion.io" }
  s.platforms    = { :ios => "13.0" }
  s.source       = { :git => "https://github.com/qonversion/react-native-sdk.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,swift}"
  s.requires_arc = true

  s.dependency "React"
  s.dependency "QonversionSandwich", "6.0.9"

end
