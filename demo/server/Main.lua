function check(Hz,WriteZi,Level)
	Rule = GetZiRulesFromC(Hz,Level)
	RunAPI=require("RunAPI")
	Level=1
	result = RunAPI:PassParametersToAPI(WriteZi,Level,Rule)
	SetReturn(result)
end
--check(Hz,WriteZi,Level)

