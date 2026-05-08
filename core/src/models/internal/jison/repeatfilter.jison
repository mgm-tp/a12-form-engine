/* lexical grammar */
%lex
%%

\"[^\"]*\"            return 'QUOTED_STRING'
\s+                   /* skip whitespace */
"kontext"             return 'GROUP'
[0-9]                 return 'DIGIT'
[A-Za-z]              return 'CHAR'
[\-]                  return '-'
[\_]                  return '_'
[\=]                  return '='
"!="				  return '!='
[\(]                  return '('
[\)]                  return ')'
[\{]                  return '{'
[\}]                  return '}'
[\[]                  return '['
[\]]                  return ']'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%start filter

%% /* language grammar */

filter
	: context operation string 'EOF'
		{
			return {
				type: "filter",
				content: $3.content,
				context: $1,
				operation: $2
			};
		}
	;

operation
	: '='
	| '!='
	;

context
	: field
	| group
	;

group
	: 'GROUP' '(' name ')' '{' context '}'
		{
			$$ = {
				type: "group",
				name: $3,
				context: $6
			};
		}
	;

field
	: '[' name ']'
		{
			$$ = {
				type: "field",
				name: $2
			};
		}
	;

name
	: namesymbol
		{
			$$ = $1;
		}
	| namesymbol name
		{
			$$ = $1 + $2;
		}
	;

namesymbol
	: 'CHAR'
	| 'DIGIT'
	| '-'
	| '_'
	;

string
	: 'QUOTED_STRING'
		{
			$$ = {
				type: "string",
				content: $1.substring(1, $1.length - 1)
			};
		}
	;

%%

/**
 * This exports the module as commonjs
 *
 * Note: This is necessary because in commonjs mode jison will return a main method that needs the module fs.
 */
exports.parse = function() {
	return repeatfilter.parse.apply(repeatfilter, arguments);
};
