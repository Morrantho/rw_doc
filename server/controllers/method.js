module.exports=
{
	one:function(req,res)
	{
		m_method.find({title:req.params.id},(e,data) => {
			return e?res.json(e):res.json(data);
		});
	},
	all:function(req,res)
	{
		m_method.find({},(e,data)=>{
			return e?res.json(e):res.json(data);
		});
	},
	push:function(req,res)
	{
		let o=new m_method(req.body);
		o.save(e=>e?res.json(e):res.json(o));
	},
	delet:function(req,res)
	{
		m_method.deleteOne({title:req.params.id},e=>e?res.json(e):res.json());
	}
};