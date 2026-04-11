local M = {}

---@param ls any
---@param str_util any
M.load = function(ls, str_util)
	local s = ls.snippet
	local t = ls.text_node
	local i = ls.insert_node
	local f = ls.function_node

	local function class_name(_, snip)
		return str_util.toPascalCase(snip.env.TM_FILENAME_BASE)
	end

	local function base_name(_, snip)
		local name = snip.env.TM_FILENAME_BASE:match("^(.+)%..+$") or snip.env.TM_FILENAME_BASE
		return str_util.toPascalCase(name)
	end

	ls.add_snippets("typescript", {
		s("ds", {
			t("type "),
			f(base_name, {}),
			t({ "Command = {", "\t" }),
			i(1),
			t({ "", "};", "", "export class " }),
			f(base_name, {}),
			t({ "Service {", "\tconstructor(private ctx: {}) {}", "", "\tasync execute(cmd: " }),
			f(base_name, {}),
			t({ "Command) {", "" }),
			i(2),
			t({ "", "\t}", "}" }),
		}),
		s("dm", {
			t("type "),
			f(class_name, {}),
			t({ "Props = {", "\t" }),
			i(1),
			t({ "", "}", "", "export class " }),
			f(class_name, {}),
			t({ " {", "\tprivate props: " }),
			f(class_name, {}),
			t({ "Props;", "", "\tconstructor(params: " }),
			f(class_name, {}),
			t({
				"Props) {",
				"\t\tthis.props = params;",
				"\t}",
				"",
				"\tget data() {",
				"\t\treturn { ...this.props };",
				"\t}",
				"}",
			}),
		}),
	})
end

return M
