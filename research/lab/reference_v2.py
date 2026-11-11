# SPDX-License-Identifier: Apache-2.0
"""INM physically referenced book study V2 (NOT deployed).
Real scanned Poly Haven bookcloth + ambientCG paper PBR;
individual curved, bent signatures rather than two continuous paper blocks.
This is a static comparison study before any web integration.
"""
import bpy, math, random, sys
from pathlib import Path
from mathutils import Vector

HERE=Path(__file__).resolve().parent
ASSET=HERE/'assets'
TEXTURES=HERE.parent/'textures'
argv=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
VIEW=argv[0] if argv else 'oblique'
SAMPLES=int(argv[1]) if len(argv)>1 else 32
random.seed(57721)

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
sc=bpy.context.scene
sc.render.engine='CYCLES'
sc.cycles.samples=SAMPLES
sc.cycles.use_denoising=True
sc.render.resolution_x=1200 if VIEW=='macro' else 1360
sc.render.resolution_y=850 if VIEW=='macro' else 930
sc.render.resolution_percentage=100
sc.render.image_settings.file_format='PNG'
sc.render.film_transparent=False
sc.view_settings.view_transform='AgX'
sc.view_settings.look='AgX - Medium High Contrast'
sc.view_settings.exposure=-1.30
sc.view_settings.gamma=1.0
sc.world.use_nodes=True
sc.world.node_tree.nodes.get('Background').inputs['Color'].default_value=(.72,.67,.62,1)
sc.world.node_tree.nodes.get('Background').inputs['Strength'].default_value=.20

def principled(name,color,roughness=.88):
    m=bpy.data.materials.new(name);m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Roughness'].default_value=roughness
    p.inputs['Metallic'].default_value=0
    return m

def tex_node(nodes,path,noncolor=False):
    t=nodes.new('ShaderNodeTexImage')
    t.image=bpy.data.images.load(str(path),check_existing=True)
    t.interpolation='Linear'
    if noncolor:t.image.colorspace_settings.name='Non-Color'
    return t

def mapped_coords(material,scale=4):
    nodes=material.node_tree.nodes
    texco=nodes.new('ShaderNodeTexCoord')
    mapping=nodes.new('ShaderNodeMapping')
    mapping.inputs['Scale'].default_value=(scale,scale,scale)
    material.node_tree.links.new(texco.outputs['Generated'],mapping.inputs['Vector'])
    return mapping.outputs['Vector']

def bookcloth_material(name,ink=None,uv=True):
    m=principled(name,(.83,.801,.738),.88)
    nodes=m.node_tree.nodes;links=m.node_tree.links;p=nodes.get('Principled BSDF')
    inp=mapped_coords(m,2.4)
    cloth_col=tex_node(nodes,ASSET/'bookcloth_col1.jpg')
    cloth_nor=tex_node(nodes,ASSET/'bookcloth_nor_gl.jpg',True)
    cloth_rough=tex_node(nodes,ASSET/'bookcloth_rough.jpg',True)
    for node in (cloth_col,cloth_nor,cloth_rough):links.new(inp,node.inputs['Vector'])
    toBW=nodes.new('ShaderNodeRGBToBW')
    links.new(cloth_col.outputs['Color'],toBW.inputs['Color'])
    ramp=nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.elements.remove(ramp.color_ramp.elements[1])
    e0=ramp.color_ramp.elements[0];e0.position=.03;e0.color=(.715,.692,.64,1)
    e1=ramp.color_ramp.elements.new(.6);e1.color=(.865,.835,.78,1)
    links.new(toBW.outputs['Val'],ramp.inputs['Fac'])
    if not ink:links.new(ramp.outputs['Color'],p.inputs['Base Color'])
    else:
        art=tex_node(nodes,ink)
        art_coord=nodes.new('ShaderNodeTexCoord')
        links.new(art_coord.outputs['UV'],art.inputs['Vector'])
        links.new(art.outputs['Color'],p.inputs['Base Color'])
    nm=nodes.new('ShaderNodeNormalMap');nm.inputs['Strength'].default_value=.42
    links.new(cloth_nor.outputs['Color'],nm.inputs['Color'])
    links.new(nm.outputs['Normal'],p.inputs['Normal'])
    links.new(cloth_rough.outputs['Color'],p.inputs['Roughness'])
    if p.inputs.get('Sheen Weight'):p.inputs['Sheen Weight'].default_value=.17
    return m

def paper_material(name,tint=(1,1,1),printed=None):
    m=principled(name,(.86,.85,.80),.97)
    nodes=m.node_tree.nodes;links=m.node_tree.links;p=nodes.get('Principled BSDF')
    inp=mapped_coords(m,3.5)
    color=tex_node(nodes,ASSET/'paper'/'Paper001_1K-JPG_Color.jpg')
    normal=tex_node(nodes,ASSET/'paper'/'Paper001_1K-JPG_NormalGL.jpg',True)
    rough=tex_node(nodes,ASSET/'paper'/'Paper001_1K-JPG_Roughness.jpg',True)
    for node in (color,normal,rough):links.new(inp,node.inputs['Vector'])
    if not printed:
        tintnode=nodes.new('ShaderNodeMixRGB')
        tintnode.blend_type='MULTIPLY'
        tintnode.inputs[0].default_value=1.0
        tintnode.inputs[2].default_value=(*tint,1)
        links.new(color.outputs['Color'],tintnode.inputs[1])
        links.new(tintnode.outputs[0],p.inputs['Base Color'])
    else:
        tex=tex_node(nodes,printed)
        uv=nodes.new('ShaderNodeTexCoord')
        links.new(uv.outputs['UV'],tex.inputs['Vector'])
        paper_tint=nodes.new('ShaderNodeMixRGB')
        paper_tint.blend_type='MULTIPLY'
        paper_tint.inputs[0].default_value=1.0
        paper_tint.inputs[2].default_value=(.79,.775,.73,1)
        links.new(tex.outputs['Color'],paper_tint.inputs[1])
        links.new(paper_tint.outputs[0],p.inputs['Base Color'])
    nm=nodes.new('ShaderNodeNormalMap');nm.inputs['Strength'].default_value=.16
    links.new(normal.outputs['Color'],nm.inputs['Color']);links.new(nm.outputs['Normal'],p.inputs['Normal'])
    links.new(rough.outputs['Color'],p.inputs['Roughness'])
    if p.inputs.get('Subsurface Weight'):p.inputs['Subsurface Weight'].default_value=.018
    return m

linen=bookcloth_material('CC0 scanned woven bookcloth, ivory recolor')
frontMaterial=bookcloth_material('INM cover print over scanned bookcloth',TEXTURES/'front.png')
backMaterial=bookcloth_material('INM back print over scanned bookcloth',TEXTURES/'back.png')
pageMat=paper_material('Paper001 genuine surface - natural',(.77,.755,.72))
pageAlt=paper_material('Paper001 subtle warm variation',(.73,.70,.66))
pageEdge=paper_material('Paper cut roughness',(.75,.72,.68))
printLeft=paper_material('Real mathematics page 624',printed=TEXTURES/'page_0624.png')
printRight=paper_material('Real mathematics page 625',printed=TEXTURES/'page_0625.png')
endpaper=paper_material('Open cover interior endpaper',(.93,.89,.81))
threadBlue=principled('linen ochre cotton stitching',(.52,.48,.18),.97)
threadCream=principled('cream cotton stitching',(.82,.80,.67),.97)
glue=principled('neutral pH bookbinding spine lining',(.69,.65,.56),1)
signature_shadow=principled('dark natural shadow between sewn signatures',(.35,.32,.28),1)
desk=principled('warm studio tabletop',(.31,.30,.29),.94)

# model: metric, A4, heavy clothbound, 1248 printed pages
WIDTH=.210;HEIGHT=.297
CALIPER=.00010
FULL_THICKNESS=624*CALIPER
BOARD=.0026;SQUARE=.0035
OUTER_X=.2075
N_LEAVES=312
Y_MIN=-HEIGHT/2;Y_MAX=HEIGHT/2
ROOT_Z=.009
GUTTER_X=.002
random.seed(721)

def mesh(name,verts,faces,materials=None,uvs=None,mat_index=None,smooth=False):
    data=bpy.data.meshes.new(name+' geometry')
    data.from_pydata(verts,[],faces);data.update(calc_edges=True)
    ob=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(ob)
    for m in materials or []:data.materials.append(m)
    if uvs:
        lay=data.uv_layers.new(name='UVMap')
        for face in data.polygons:
            for loop in face.loop_indices:
                idx=data.loops[loop].vertex_index
                lay.data[loop].uv=uvs[idx]
    if mat_index:
        for face,id in zip(data.polygons,mat_index):face.material_index=id
    for f in data.polygons:f.use_smooth=smooth
    return ob

def rounded_board(name, center, size, mat, angle=0):
    bpy.ops.mesh.primitive_cube_add(size=1,location=center)
    ob=bpy.context.object
    ob.name=name;ob.dimensions=size
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    ob.rotation_euler.y=angle
    ob.data.materials.append(mat)
    bev=ob.modifiers.new('real cover board 2.6mm + rounded edges','BEVEL')
    bev.width=.0012;bev.segments=4
    ob.modifiers.new('correct paperboard shading','WEIGHTED_NORMAL')
    return ob

def cord(name,xyz,r,mat,cyclic=False):
    cu=bpy.data.curves.new(name,'CURVE')
    cu.dimensions='3D';cu.bevel_depth=r;cu.resolution_u=12;cu.bevel_resolution=3
    sp=cu.splines.new('POLY');sp.points.add(len(xyz)-1)
    sp.use_cyclic_u=cyclic
    for p,coord in zip(sp.points,xyz):p.co=(*coord,1)
    obj=bpy.data.objects.new(name,cu);bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    return obj

# Stable cover board attachment. French grooves are at x=+-12mm; the case spine
# bridges only the central part and NEVER becomes an unfolding paper-like flap.
for side in (-1,1):
    inner_x=.0125
    outer=WIDTH+SQUARE
    span=outer-inner_x
    center=side*(inner_x+span*.5)
    bend=(side*math.atan(.005/span))
    zbase=.0024+((outer-inner_x)*.5)*(.005/span)
    board=rounded_board(('LEFT' if side<0 else 'RIGHT')+' bookcloth hardcover board',
        (center,0,zbase),(span,HEIGHT+2*SQUARE,BOARD),linen,bend)
    inside=rounded_board('pastedown '+str(side),
        (center,0,zbase+.0014),(span-.006,HEIGHT-.008,.00015),endpaper,bend)
    cord('french joint crease '+str(side),[
        (side*inner_x,y,.0065+.00016*math.sin(y*10))
        for y in [Y_MIN+HEIGHT*i/40 for i in range(41)]
    ],.00085,linen)

# A continuous 0.65mm leather-cloth case spine U that hangs below the signatures.
# It is anchored to BOTH cover hinges and visually remains one uninterrupted
# piece under the sewn block. In a true hollow-back case only bookblock moves.
verts=[];faces=[];seg=100;along=16
for j in range(along+1):
    y=-(HEIGHT+2*SQUARE)/2+(HEIGHT+2*SQUARE)*j/along
    for i in range(seg+1):
        a=math.pi*i/seg
        x=.0125*math.cos(a)
        z=.0061-.0069*math.sin(a)+.00018*math.sin(y*15)
        verts.append((x,y,z))
for j in range(along):
    for i in range(seg):
        a=j*(seg+1)+i
        faces.append((a,a+1,a+seg+2,a+seg+1))
case=mesh('ONE unbroken external cloth spine',verts,faces,[linen],smooth=True)
case.modifiers.new('clothboard physical thickness','SOLIDIFY').thickness=.00065

# Backing is a partially hidden linen surface. A rigid gutter rod is unrealistic.
for sign in (-1,1):
    y=sign*HEIGHT/2
    for k in range(28):
        a0=math.pi*k/28;a1=math.pi*(k+.93)/28
        pts=[(.0125*math.cos(a0+(a1-a0)*i/8),
              y, .0061-.0069*math.sin(a0+(a1-a0)*i/8)+.0015)
             for i in range(9)]
        cord('headband stitch '+str(sign)+'/'+str(k),pts,.00027,threadBlue if k%2 else threadCream)

# True sewn leaf: the cross-section follows a strongly non-linear quarter-arc,
# close to the 90-degree inner leaf tangent visible in the physical reference.
# The use of sqrt(u) is critical. The previously rejected S-shape looked like
# a CNC-carved wedge; it had the wrong *tangent* at the gutter.
def bend_curve(u):
    return math.sin(math.pi*.5*(max(0,u)**.69))

def leaf_point(side,k,n,u,y):
    a=(k+.5)/n
    root_x=.0025+.0085*a
    x=side*(root_x+(OUTER_X-root_x)*u)
    z_root=.0085+.0040*a
    # Signature sewing produces subtle swelling and real dark recesses at
    # every 16-sheet gathering. The total measured fore-edge remains ~31mm.
    z_fore=.0200+a*(n*.000078)+(k//16)*.00034
    quarter=bend_curve(u)
    z=z_root+(z_fore-z_root)*quarter
    # Paper is supported by sewing tension, with small local bow near the text.
    z+=.00065*math.sin(math.pi*u)*(.65+.35*math.cos(a*17))
    z+=.00020*math.sin(y*29+k*.12)*math.sin(math.pi*u)
    z+=.00012*math.sin(k*2.98+u*25)*u**10
    # The free edge of a printed leaf is rarely a mathematically perfect
    # straight line. Tiny, per-signature corner lift and slight length offset
    # separate it from the regular page-block silhouette.
    corner= max(0,abs(y)/(HEIGHT*.5)-.66)/.34
    corner= min(1,corner)**2
    z+=corner*(u**6)*(.00065*math.sin(k*.071)+.00034*math.sin(k*.33))
    if k==n-1:
        z+=corner*(u**7)*.00095
    return (x,y,z)

def leaf_stack(side):
    n=N_LEAVES
    verts=[];faces=[];index=[]
    nx=33;ny=3
    GRID=(nx+1)*(ny+1)
    thickness=CALIPER*.67
    def lookup(base,j,i):return base+j*(nx+1)+i
    for k in range(n):
        beginning=len(verts)
        for layer in (0,1):
            for j in range(ny+1):
                y=Y_MIN+HEIGHT*j/ny
                for i in range(nx+1):
                    u=i/nx
                    x0,yy,z=leaf_point(side,k,n,u,y)
                    # Paper underside is not a disconnected 2D render plane.
                    verts.append((x0,yy,z-layer*thickness))
        for layer in (0,1):
            base=beginning+layer*GRID
            for j in range(ny):
                for i in range(nx):
                    a,b,c,d=(lookup(base,j,i),lookup(base,j,i+1),
                             lookup(base,j+1,i+1),lookup(base,j+1,i))
                    faces.append((a,b,c,d) if (layer==0)==(side>0) else (d,c,b,a))
                    index.append((k%16==0) or (k%16==1))
        # Folded outer edges, and the head/tail cuts of real sheet stock.
        b0=beginning;b1=beginning+GRID
        for j in range(ny):
            faces.append((lookup(b0,j,nx),lookup(b0,j+1,nx),
                          lookup(b1,j+1,nx),lookup(b1,j,nx)))
            index.append(2)
        for j in (0,ny):
            for i in range(nx):
                faces.append((lookup(b0,j,i),lookup(b0,j,i+1),
                              lookup(b1,j,i+1),lookup(b1,j,i)))
                index.append(2)
    book=mesh(('right' if side>0 else 'left')+' 312 individually curved paper leaves',
            verts,faces,[pageMat,pageAlt,pageEdge],mat_index=index)
    # Actual gaps at gathering boundaries follow individual sheet trajectories.
    # These are 3D shadow creases 0.12mm deep, not lines painted on a slab.
    for k in range(16,n,16):
        for edge_y in (Y_MIN-.00005,Y_MAX+.00005):
            pts=[]
            for i in range(31):
                u=.035+.95*i/30
                x,_,z=leaf_point(side,k,n,u,edge_y)
                pts.append((x,edge_y,z-.00012))
            cord(('left' if side<0 else 'right')+
                 ' signature gap '+str(k)+' '+str(edge_y),
                 pts,.000085,signature_shadow)
    # The top visible page receives the manuscript PDF as texture along its
    # curved surface, rather than a rigid rectangular page.
    verts=[];uv=[];faces=[]
    nx2=72;ny2=28
    for j in range(ny2+1):
        y=Y_MIN+HEIGHT*j/ny2
        for i in range(nx2+1):
            u=i/nx2
            x0,yy,z=leaf_point(side,n-1,n,u,y)
            verts.append((x0,yy,z+.00012))
            uv.append(((u if side>0 else 1-u),j/ny2))
    for j in range(ny2):
        for i in range(nx2):
            idx=j*(nx2+1)+i
            face=(idx,idx+1,idx+nx2+2,idx+nx2+1)
            faces.append(face if side>0 else tuple(reversed(face)))
    mesh('curved printed INM page '+str(625 if side>0 else 624),
         verts,faces,[printRight if side>0 else printLeft],uvs=uv,smooth=True)

# Soft mull reinforcement under the signatures. In a sewn hardback this
# cloth surface remains visible in the shadowed hollow above the case boards.
for side in (-1,1):
    verts=[];faces=[];uvs=[]
    nx=32;ny=10
    for j in range(ny+1):
        y=Y_MIN+.003+(HEIGHT-.006)*j/ny
        for i in range(nx+1):
            u=i/nx
            x=side*(.009+.195*u)
            z=.0057+.0015*math.sin(math.pi*u)+.00025*math.sin(y*18+u*6)
            verts.append((x,y,z))
            uvs.append((u,j/ny))
    for j in range(ny):
        for i in range(nx):
            idx=j*(nx+1)+i
            q=(idx,idx+1,idx+nx+2,idx+nx+1)
            faces.append(q if side>0 else tuple(reversed(q)))
    mesh(('left' if side<0 else 'right')+' mull reinforcement backing',
         verts,faces,[glue],uvs=uvs,smooth=True)

leaf_stack(-1);leaf_stack(1)

# A physical studio desk and authentic softbox illumination with contact shadows.
surface=rounded_board('warm studio surface',(0,0,-.012),(3.0,2.4,.018),desk,0)
def area(name,where,energy,size,target=(0,0,.025)):
    dat=bpy.data.lights.new(name,'AREA');dat.energy=energy;dat.shape='DISK';dat.size=size
    ob=bpy.data.objects.new(name,dat);bpy.context.collection.objects.link(ob)
    ob.location=where;ob.rotation_euler=(Vector(target)-ob.location).to_track_quat('-Z','Y').to_euler()
area('large key photographic octabox',(-.44,-.35,.77),33,.55)
area('fill side white softbox',(.45,.20,.69),12,.65)
area('warm edge from behind',(0,.54,.42),14,.4)

cam_data=bpy.data.cameras.new('full frame book camera')
cam=bpy.data.objects.new('camera',cam_data);bpy.context.collection.objects.link(cam)
if VIEW=='macro':
    camera_pos=(.005,-.51,.115)
    focus=(0,0,.031)
    cam_data.type='PERSP';cam_data.lens=56
elif VIEW=='top':
    camera_pos=(.34,-.38,.44)
    focus=(0,0,.028)
    cam_data.type='PERSP';cam_data.lens=61
else:
    camera_pos=(.32,-.42,.31)
    focus=(0,0,.028)
    cam_data.type='PERSP';cam_data.lens=51
cam.location=camera_pos
cam.rotation_euler=(Vector(focus)-cam.location).to_track_quat('-Z','Y').to_euler()
cam_data.dof.use_dof=True
cam_data.dof.focus_distance=(Vector(focus)-cam.location).length
cam_data.dof.aperture_fstop=8 if VIEW=='macro' else 9
sc.camera=cam
sc.render.filepath=str(HERE/f'reference-v2-{VIEW}.png')
# Keep .blend reusable for inspection and future glTF export / rigging.
bpy.ops.wm.save_as_mainfile(filepath=str(HERE/f'INM-reference-v2-{VIEW}.blend'),compress=True)
print('MODEL',VIEW,len(bpy.data.objects),'objects',sum(len(o.data.vertices) for o in bpy.data.objects if o.type=='MESH'),'mesh vertices',flush=True)
bpy.ops.render.render(write_still=True)
print('OUTPUT',sc.render.filepath,flush=True)
